import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Badge } from "@heroui/badge";
import { Tabs, Tab } from "@heroui/tabs";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Code } from "@heroui/code";
import { Checkbox } from "@heroui/checkbox";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

interface MaestroRun {
  run_id: string;
  status: string;
  result?: string;
  created_at: string;
  completed_at?: string;
  config: {
    input: string;
    assistant_name: string;
    budget: string;
    use_pro_tools: boolean;
  };
}

interface MaestroRequest {
  input: string;
  assistant_name: string;
  assistant_personality: string;
  budget: string;
  use_pro_tools: boolean;
  poll_for_completion: boolean;
}

export default function IndexPage() {
  const [runs, setRuns] = useState<MaestroRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("agent");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedRun, setSelectedRun] = useState<MaestroRun | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<MaestroRequest>({
    input: "",
    assistant_name: "web_researcher",
    assistant_personality: "You are a helpful AI assistant with access to web data tools. Use them to provide accurate, up-to-date information.",
    budget: "medium",
    use_pro_tools: true,
    poll_for_completion: true
  });

  const [currentRun, setCurrentRun] = useState<MaestroRun | null>(null);
  const [runProgress, setRunProgress] = useState(0);

  // Load runs from API
  const loadRuns = async () => {
    try {
      const response = await fetch('http://localhost:8000/runs');
      const data = await response.json();
      setRuns(data.runs || []);
    } catch (error) {
      console.error('Failed to load runs:', error);
    }
  };

  // Submit agent run
  const submitRun = async () => {
    if (!formData.input.trim()) return;
    
    setLoading(true);
    setRunProgress(0);
    
    try {
      const response = await fetch('http://localhost:8000/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      setCurrentRun(result);
      
      if (formData.poll_for_completion) {
        // Run completed immediately
        loadRuns();
        setRunProgress(100);
      } else {
        // Poll for completion
        pollRunStatus(result.run_id);
      }
    } catch (error) {
      console.error('Failed to submit run:', error);
    } finally {
      setLoading(false);
    }
  };

  // Poll run status
  const pollRunStatus = async (runId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/status/${runId}`);
        const run = await response.json();
        
        setCurrentRun(run);
        
        if (run.status === 'running') {
          setRunProgress(prev => Math.min(prev + 10, 90));
        } else if (run.status === 'completed' || run.status === 'failed') {
          setRunProgress(100);
          clearInterval(pollInterval);
          loadRuns();
        }
      } catch (error) {
        console.error('Failed to poll run status:', error);
        clearInterval(pollInterval);
      }
    }, 2000);
  };

  // View run details
  const viewRunDetails = (run: MaestroRun) => {
    setSelectedRun(run);
    onOpen();
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const personalities = [
    { key: "web_researcher", label: "Web Researcher" },
    { key: "data_analyst", label: "Data Analyst" },
    { key: "content_creator", label: "Content Creator" },
    { key: "technical_expert", label: "Technical Expert" },
  ];

  const budgets = [
    { key: "low", label: "Low Budget" },
    { key: "medium", label: "Medium Budget" },
    { key: "high", label: "High Budget" },
  ];

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="text-center">
          <h1 className={title({ color: "violet" })}>AI21 Maestro + Bright Data</h1>
          <p className={subtitle({ class: "mt-2" })}>
            Build AI agents with web access through Bright Data tools
          </p>
        </div>

        {/* Main Content */}
        <Tabs 
          aria-label="Main navigation" 
          selectedKey={selectedTab} 
          onSelectionChange={(key) => setSelectedTab(key as string)}
          className="w-full"
        >
          <Tab key="agent" title="AI Agent">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Configuration */}
              <Card className="h-fit">
                <CardHeader>
                  <h2 className="text-xl font-bold">Configure AI Agent</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Your Query or Task"
                    placeholder="e.g., Research competitor pricing for our SaaS product"
                    value={formData.input}
                    onValueChange={(value: string) => setFormData({...formData, input: value})}
                    description="Describe what you want the AI agent to research or analyze"
                  />
                  
                  <Select
                    label="Assistant Type"
                    selectedKeys={[formData.assistant_name]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string;
                      setFormData({...formData, assistant_name: key});
                    }}
                  >
                    {personalities.map((personality) => (
                      <SelectItem key={personality.key}>
                        {personality.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Budget Level"
                    selectedKeys={[formData.budget]}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string;
                      setFormData({...formData, budget: key});
                    }}
                  >
                    {budgets.map((budget) => (
                      <SelectItem key={budget.key}>
                        {budget.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <div className="flex flex-col gap-3">
                    <Checkbox
                      isSelected={formData.use_pro_tools}
                      onValueChange={(checked) => setFormData({...formData, use_pro_tools: checked})}
                    >
                      Use Pro Tools (Advanced web scraping capabilities)
                    </Checkbox>
                    
                    <Checkbox
                      isSelected={formData.poll_for_completion}
                      onValueChange={(checked) => setFormData({...formData, poll_for_completion: checked})}
                    >
                      Wait for completion (vs. run in background)
                    </Checkbox>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full"
                    onPress={submitRun}
                    isLoading={loading}
                    disabled={!formData.input.trim()}
                  >
                    {loading ? "Running Agent..." : "Run AI Agent"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Current Run Status */}
              <Card className="h-fit">
                <CardHeader>
                  <h2 className="text-xl font-bold">Current Run</h2>
                </CardHeader>
                <CardBody>
                  {currentRun ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Run ID:</span>
                        <Code size="sm">{currentRun.run_id}</Code>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <Chip
                          color={
                            currentRun.status === 'completed' ? 'success' :
                            currentRun.status === 'failed' ? 'danger' :
                            currentRun.status === 'running' ? 'warning' : 'default'
                          }
                          size="sm"
                        >
                          {currentRun.status}
                        </Chip>
                      </div>

                      {(currentRun.status === 'running' || currentRun.status === 'starting') && (
                        <Progress
                          value={runProgress}
                          color="primary"
                          className="w-full"
                          label="Processing..."
                        />
                      )}

                      {currentRun.result && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium">Result:</span>
                          <div className="p-3 bg-content2 rounded-lg max-h-40 overflow-y-auto">
                            <p className="text-sm whitespace-pre-wrap">{currentRun.result}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-default-500">
                      <p>No active run</p>
                      <p className="text-sm">Submit a query to get started</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="history" title="Run History">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-xl font-bold">Run History</h2>
                  <Button size="sm" variant="flat" onPress={loadRuns}>
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {runs.length > 0 ? (
                  <Table aria-label="Run history table">
                    <TableHeader>
                      <TableColumn>RUN ID</TableColumn>
                      <TableColumn>QUERY</TableColumn>
                      <TableColumn>STATUS</TableColumn>
                      <TableColumn>BUDGET</TableColumn>
                      <TableColumn>CREATED</TableColumn>
                      <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {runs.map((run) => (
                        <TableRow key={run.run_id}>
                          <TableCell>
                            <Code size="sm">{run.run_id.slice(0, 8)}...</Code>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate">{run.config?.input || 'No query available'}</p>
                          </TableCell>
                          <TableCell>
                            <Chip
                              color={
                                run.status === 'completed' ? 'success' :
                                run.status === 'failed' ? 'danger' :
                                run.status === 'running' ? 'warning' : 'default'
                              }
                              size="sm"
                            >
                              {run.status}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <Badge color="primary" size="sm">
                              {run.config?.budget || 'unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(run.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => viewRunDetails(run)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center text-default-500 py-8">
                    <p>No runs yet</p>
                    <p className="text-sm">Your agent runs will appear here</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Tab>

          <Tab key="tools" title="Available Tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Rapid Tools (Free)</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge color="success" variant="flat">FREE</Badge>
                      <div>
                        <h4 className="font-medium">Search Engine</h4>
                        <p className="text-sm text-default-500">Scrape search results from Google, Bing or Yandex</p>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex items-start gap-3">
                      <Badge color="success" variant="flat">FREE</Badge>
                      <div>
                        <h4 className="font-medium">Web Scraper</h4>
                        <p className="text-sm text-default-500">Scrape any webpage as clean markdown</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Pro Tools</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge color="warning" variant="flat">PRO</Badge>
                      <div>
                        <h4 className="font-medium">E-commerce Data</h4>
                        <p className="text-sm text-default-500">Amazon, Walmart, eBay, and more</p>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex items-start gap-3">
                      <Badge color="warning" variant="flat">PRO</Badge>
                      <div>
                        <h4 className="font-medium">Social Media</h4>
                        <p className="text-sm text-default-500">LinkedIn, Instagram, Twitter, TikTok</p>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex items-start gap-3">
                      <Badge color="warning" variant="flat">PRO</Badge>
                      <div>
                        <h4 className="font-medium">Business Intelligence</h4>
                        <p className="text-sm text-default-500">ZoomInfo, Crunchbase, job listings</p>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex items-start gap-3">
                      <Badge color="warning" variant="flat">PRO</Badge>
                      <div>
                        <h4 className="font-medium">Browser Automation</h4>
                        <p className="text-sm text-default-500">Navigate, click, type, screenshot</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>

        {/* Run Details Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Run Details
                  {selectedRun && (
                    <Code size="sm">{selectedRun.run_id}</Code>
                  )}
                </ModalHeader>
                <ModalBody>
                  {selectedRun && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Query</h4>
                        <div className="p-3 bg-content2 rounded-lg">
                          <p className="whitespace-pre-wrap">{selectedRun.config.input}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Configuration</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Assistant:</strong> {selectedRun.config.assistant_name}</p>
                            <p><strong>Budget:</strong> {selectedRun.config.budget}</p>
                            <p><strong>Pro Tools:</strong> {selectedRun.config.use_pro_tools ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Timing</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Created:</strong> {new Date(selectedRun.created_at).toLocaleString()}</p>
                            {selectedRun.completed_at && (
                              <p><strong>Completed:</strong> {new Date(selectedRun.completed_at).toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {selectedRun.result && (
                        <div>
                          <h4 className="font-medium mb-2">Result</h4>
                          <div className="p-3 bg-content2 rounded-lg max-h-96 overflow-y-auto">
                            <p className="whitespace-pre-wrap text-sm">{selectedRun.result}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </DefaultLayout>
  );
}

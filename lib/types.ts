export type JiraTicket = {
  title: string;
  description: string;
  acceptanceCriteria: string[];
};

export type GenerateResponse = {
  prd: string;
  userStories: string[];
  jiraTickets: JiraTicket[];
  risks: string[];
};

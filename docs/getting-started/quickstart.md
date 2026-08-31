# Quickstart

```ts
import { OkatanaClient } from '@newfoundcodes/okatana';

const okatana = new OkatanaClient({
  baseUrl: process.env.OKATANA_URL!,
  apiKey: process.env.OKATANA_API_KEY!,
});

const organizationId = process.env.OKATANA_ORGANIZATION_ID!;

const organization = await okatana.organizations.get(organizationId);
console.log(organization.id, organization.name);

const project = await okatana.organizations.createProject(organizationId, {
  name: 'Platform',
  key: 'PLAT',
  description: 'Platform engineering work',
});

const ticket = await okatana.projects.createTicket(project.id, {
  boardSlug: 'open',
  title: 'Design deployment runbook',
  descriptionHtml: '<p>Write and review the first version.</p>',
  priority: 'high',
});

await okatana.tickets.createComment(ticket.id, {
  bodyHtml: '<p>Initial task created by automation.</p>',
});
```

The public SDK uses camelCase. The transport sends Okatana's wire names such as `board_slug`, `description_html`, and `body_html`.

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">📚 SaaS Starter API Documentation</h1>
          <p className="text-lg text-gray-600">Complete guide to integrating with your SaaS API infrastructure</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="api-endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🚀 Getting Started</CardTitle>
                  <CardDescription>Quick start guide to using the SaaS Starter API</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">1. Get Your API Token</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Sign up for a free account to get your unique API token:
                    </p>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      curl -X POST "https://your-domain.com/api/signup" \<br />
                      &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                      &nbsp;&nbsp;-d '{"{"}"email": "your@email.com", "name": "Your Name"{"}"}'
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">2. Authentication</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      All API endpoints require your token as a query parameter:
                    </p>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">?token=YOUR_API_TOKEN</div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">3. Base URL</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">https://your-domain.com/api/</div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">4. Response Format</h4>
                    <p className="text-sm text-gray-600 mb-2">All responses follow this structure:</p>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      {`{
  "success": true,
  "data": { ... },
  "message": "Success"
}`}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📊 Rate Limits & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded p-4">
                      <h4 className="font-semibold text-green-600 mb-2">Free Tier</h4>
                      <ul className="text-sm space-y-1">
                        <li>• 1,000 API calls per month</li>
                        <li>• All endpoints included</li>
                        <li>• Rate limit: 100 requests/minute</li>
                        <li>• Community support</li>
                      </ul>
                    </div>
                    <div className="border rounded p-4">
                      <h4 className="font-semibold text-blue-600 mb-2">Status Codes</h4>
                      <ul className="text-sm space-y-1">
                        <li>
                          • <Badge variant="default">200</Badge> Success
                        </li>
                        <li>
                          • <Badge variant="destructive">400</Badge> Bad Request
                        </li>
                        <li>
                          • <Badge variant="destructive">401</Badge> Unauthorized
                        </li>
                        <li>
                          • <Badge variant="destructive">404</Badge> Not Found
                        </li>
                        <li>
                          • <Badge variant="destructive">500</Badge> Server Error
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="authentication">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🔐 Authentication</CardTitle>
                  <CardDescription>How to authenticate your API requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Token-Based Authentication</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      All API requests require a valid token passed as a query parameter:
                    </p>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      GET /api/example?token=YOUR_API_TOKEN
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Getting Your Token</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Sign up to receive your unique API token:
                    </p>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      {`curl -X POST "https://your-domain.com/api/signup" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Your Name",
    "email": "your@email.com"
  }'`}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Response will include your unique token that you can use for all API calls.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Error Responses</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Invalid or missing tokens will return a 401 Unauthorized error:
                    </p>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      {`{
  "success": false,
  "error": "Invalid or missing token",
  "message": "Please provide a valid API token"
}`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api-endpoints">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🔗 API Endpoints</CardTitle>
                  <CardDescription>Available API endpoints and their usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">GET /api/example</h4>
                    <p className="text-sm text-gray-600 mb-2">Get example data from the API</p>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      curl "https://your-domain.com/api/example?token=YOUR_TOKEN"
                    </div>
                    <div className="mt-2 text-sm">
                      <strong>Response:</strong>
                      <div className="bg-gray-50 p-2 rounded mt-1 font-mono text-xs">
                        {`{
  "success": true,
  "data": {
    "message": "Hello from your SaaS API!",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "items": [...]
  }
}`}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">GET /api/example/{"{id}"}</h4>
                    <p className="text-sm text-gray-600 mb-2">Get a specific item by ID</p>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      curl "https://your-domain.com/api/example/1?token=YOUR_TOKEN"
                    </div>
                    <div className="mt-2 text-sm">
                      <strong>Response:</strong>
                      <div className="bg-gray-50 p-2 rounded mt-1 font-mono text-xs">
                        {`{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sample Item 1",
    "description": "This is a sample item",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}`}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">POST /api/example</h4>
                    <p className="text-sm text-gray-600 mb-2">Create a new item</p>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      {`curl -X POST "https://your-domain.com/api/example?token=YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "New Item",
    "description": "Description of the new item"
  }'`}
                    </div>
                    <div className="mt-2 text-sm">
                      <strong>Response:</strong>
                      <div className="bg-gray-50 p-2 rounded mt-1 font-mono text-xs">
                        {`{
  "success": true,
  "data": {
    "id": 123,
    "name": "New Item",
    "description": "Description of the new item",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Item created successfully"
}`}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">POST /api/signup</h4>
                    <p className="text-sm text-gray-600 mb-2">Create a new user account and get API token</p>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      {`curl -X POST "https://your-domain.com/api/signup" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Your Name",
    "email": "your@email.com"
  }'`}
                    </div>
                    <div className="mt-2 text-sm">
                      <strong>Response:</strong>
                      <div className="bg-gray-50 p-2 rounded mt-1 font-mono text-xs">
                        {`{
  "success": true,
  "data": {
    "user": {
      "name": "Your Name",
      "email": "your@email.com",
      "token": "your_unique_api_token_here"
    }
  },
  "message": "Account created successfully"
}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>💻 Code Examples</CardTitle>
                  <CardDescription>Integration examples in different programming languages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">JavaScript/Node.js</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      {`const token = 'YOUR_API_TOKEN';

// Get example data
const response = await fetch(\`https://your-domain.com/api/example?token=\${token}\`);
const data = await response.json();
console.log(data);

// Create new item
const newItem = await fetch(\`https://your-domain.com/api/example?token=\${token}\`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Item',
    description: 'Item description'
  })
});
const result = await newItem.json();`}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Python</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      {`import requests

token = 'YOUR_API_TOKEN'
base_url = 'https://your-domain.com/api'

# Get example data
response = requests.get(f'{base_url}/example?token={token}')
data = response.json()
print(data)

# Create new item
new_item = {
    'name': 'New Item',
    'description': 'Item description'
}
response = requests.post(
    f'{base_url}/example?token={token}',
    json=new_item
)
result = response.json()`}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">PHP</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      {`<?php
$token = 'YOUR_API_TOKEN';
$base_url = 'https://your-domain.com/api';

// Get example data
$response = file_get_contents("$base_url/example?token=$token");
$data = json_decode($response, true);
print_r($data);

// Create new item
$new_item = [
    'name' => 'New Item',
    'description' => 'Item description'
];

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($new_item)
    ]
]);

$response = file_get_contents("$base_url/example?token=$token", false, $context);
$result = json_decode($response, true);
?>`}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">cURL</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      {`# Get example data
curl "https://your-domain.com/api/example?token=YOUR_TOKEN"

# Get specific item
curl "https://your-domain.com/api/example/1?token=YOUR_TOKEN"

# Create new item
curl -X POST "https://your-domain.com/api/example?token=YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "New Item",
    "description": "Item description"
  }'

# Sign up for API token
curl -X POST "https://your-domain.com/api/signup" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Your Name",
    "email": "your@email.com"
  }'`}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🛠️ Customization Tips</CardTitle>
                  <CardDescription>How to customize this template for your needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">1. Replace Example Endpoints</h4>
                    <p className="text-sm text-gray-600">
                      The <code>/api/example</code> endpoints are placeholders. Replace them with your actual business logic:
                    </p>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• Edit files in <code>app/api/example/</code></li>
                      <li>• Create new API routes for your features</li>
                      <li>• Update database models as needed</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">2. Update Documentation</h4>
                    <p className="text-sm text-gray-600">
                      Customize this documentation page to reflect your API:
                    </p>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• Edit <code>app/docs/page.tsx</code></li>
                      <li>• Update endpoint descriptions</li>
                      <li>• Add your own examples</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">3. Customize Branding</h4>
                    <p className="text-sm text-gray-600">
                      Update the template to match your brand:
                    </p>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• Change colors in <code>tailwind.config.js</code></li>
                      <li>• Update logos and favicons in <code>public/</code></li>
                      <li>• Modify metadata in <code>app/layout.tsx</code></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

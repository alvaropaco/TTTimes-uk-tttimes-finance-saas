import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h1>
        <p className="text-lg text-gray-600">Complete guide to using the TTTimes Finance API</p>
      </div>

      {/* Authentication */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>All API requests require authentication using your API key</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Header Required:</h4>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">Authorization: Bearer YOUR_API_KEY</div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Rate Limiting:</h4>
            <p className="text-gray-600">
              Each API key is limited to 100 requests per day. Exceeding this limit will return a 429 error.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Get All Rates</CardTitle>
              <Badge variant="secondary">GET</Badge>
            </div>
            <CardDescription>/api/rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Returns all available currency exchange rates based on USD.</p>

            <div>
              <h4 className="font-semibold mb-2">Example Response:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`{
  "success": true,
  "data": [
    {
      "currency": "Rial Saudita",
      "code": "SAR",
      "rate": 3.75053961,
      "example": "3.75",
      "lastUpdated": "2025-07-17T15:21:10.965Z"
    }
  ],
  "total": 1
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Convert Currency</CardTitle>
              <Badge variant="secondary">GET</Badge>
            </div>
            <CardDescription>/api/convert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Convert between any supported currencies in real-time.</p>

            <div>
              <h4 className="font-semibold mb-2">Query Parameters:</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>
                  <code>from</code> - Source currency code (e.g., SAR)
                </li>
                <li>
                  <code>to</code> - Target currency code (e.g., USD)
                </li>
                <li>
                  <code>amount</code> - Amount to convert (default: 1)
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Request:</h4>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                GET /api/convert?from=SAR&to=USD&amount=1000
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Response:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`{
  "success": true,
  "data": {
    "from": "SAR",
    "to": "USD",
    "amount": 1000,
    "result": 266.664,
    "rate": 0.266664
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Supported Currencies</CardTitle>
              <Badge variant="secondary">GET</Badge>
            </div>
            <CardDescription>/api/supported</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Returns a list of all supported currency codes and names.</p>

            <div>
              <h4 className="font-semibold mb-2">Example Response:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`{
  "success": true,
  "data": [
    {
      "code": "USD",
      "name": "US Dollar"
    },
    {
      "code": "SAR",
      "name": "Rial Saudita"
    }
  ],
  "total": 2
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Get Single Rate</CardTitle>
              <Badge variant="secondary">GET</Badge>
            </div>
            <CardDescription>/api/rate/:iso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Get the exchange rate for a specific currency.</p>

            <div>
              <h4 className="font-semibold mb-2">Example Request:</h4>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">GET /api/rate/SAR</div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Response:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`{
  "success": true,
  "data": {
    "currency": "Rial Saudita",
    "code": "SAR",
    "rate": 3.75053961,
    "example": "3.75",
    "lastUpdated": "2025-07-17T15:21:10.965Z"
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Responses */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Error Responses</CardTitle>
          <CardDescription>Common error responses you might encounter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">401 Unauthorized:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {`{
  "error": "API key required"
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">429 Rate Limit Exceeded:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {`{
  "error": "Rate limit exceeded. Try again tomorrow."
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">404 Not Found:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {`{
  "error": "Currency SAR not found"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

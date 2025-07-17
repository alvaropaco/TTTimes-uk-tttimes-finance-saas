"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, Database, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function TestPage() {
  const [healthResult, setHealthResult] = useState<any>(null)
  const [connectionResult, setConnectionResult] = useState<any>(null)
  const [loading, setLoading] = useState<{ health: boolean; connection: boolean }>({
    health: false,
    connection: false,
  })

  const testHealth = async () => {
    setLoading((prev) => ({ ...prev, health: true }))
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setHealthResult(data)
    } catch (error) {
      setHealthResult({ status: "error", error: "Network error" })
    } finally {
      setLoading((prev) => ({ ...prev, health: false }))
    }
  }

  const testConnection = async () => {
    setLoading((prev) => ({ ...prev, connection: true }))
    try {
      const response = await fetch("/api/test-connection")
      const data = await response.json()
      setConnectionResult(data)
    } catch (error) {
      setConnectionResult({ status: "error", error: "Network error" })
    } finally {
      setLoading((prev) => ({ ...prev, connection: false }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold">Zodii Connection Test</span>
            </Link>
            <div className="space-x-4">
              <Link href="/docs">
                <Button variant="outline">API Docs</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Database Connection Test</h1>
            <p className="text-gray-600">Test your MongoDB connection and verify everything is working correctly</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Health Check */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Health Check</span>
                </CardTitle>
                <CardDescription>Basic database health and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={testHealth} disabled={loading.health} className="w-full">
                  {loading.health ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Run Health Check"
                  )}
                </Button>

                {healthResult && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {healthResult.status === "healthy" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <Badge variant={healthResult.status === "healthy" ? "default" : "destructive"}>
                        {healthResult.status}
                      </Badge>
                    </div>

                    {healthResult.status === "healthy" && (
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Database:</strong> {healthResult.database}
                        </p>
                        {healthResult.db_name && (
                          <p>
                            <strong>DB Name:</strong> {healthResult.db_name}
                          </p>
                        )}
                        {healthResult.collections && (
                          <p>
                            <strong>Collections:</strong> {healthResult.collections.join(", ") || "None"}
                          </p>
                        )}
                        {healthResult.user_count !== undefined && (
                          <p>
                            <strong>Users:</strong> {healthResult.user_count}
                          </p>
                        )}
                      </div>
                    )}

                    {healthResult.error && (
                      <Alert variant="destructive">
                        <AlertDescription>{healthResult.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Connection Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Full Connection Test</span>
                </CardTitle>
                <CardDescription>Comprehensive database operations test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={testConnection} disabled={loading.connection} className="w-full">
                  {loading.connection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Run Full Test"
                  )}
                </Button>

                {connectionResult && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {connectionResult.status === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <Badge variant={connectionResult.status === "success" ? "default" : "destructive"}>
                        {connectionResult.status}
                      </Badge>
                    </div>

                    {connectionResult.status === "success" && (
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Database:</strong> {connectionResult.database}
                        </p>
                        {connectionResult.db_name && (
                          <p>
                            <strong>DB Name:</strong> {connectionResult.db_name}
                          </p>
                        )}
                        {connectionResult.collections && (
                          <p>
                            <strong>Collections:</strong> {connectionResult.collections.join(", ") || "None"}
                          </p>
                        )}
                        {connectionResult.test_results && (
                          <div>
                            <p>
                              <strong>User Operations:</strong>
                            </p>
                            <ul className="ml-4 text-xs">
                              <li>Creation: {connectionResult.test_results.user_creation}</li>
                              <li>Retrieval: {connectionResult.test_results.user_retrieval}</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {connectionResult.error && (
                      <Alert variant="destructive">
                        <AlertDescription>{connectionResult.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>How to configure MongoDB for Zodii</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Local MongoDB</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                  {`# Install MongoDB locally
brew install mongodb/brew/mongodb-community  # macOS
# OR
sudo apt install mongodb  # Ubuntu

# Start MongoDB
brew services start mongodb/brew/mongodb-community  # macOS
# OR
sudo systemctl start mongod  # Ubuntu

# Set environment variable
MONGODB_URI=mongodb://localhost:27017/zodii`}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. MongoDB Atlas (Cloud)</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                  {`# Create account at https://cloud.mongodb.com
# Create cluster and get connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zodii`}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Initialize Database</h4>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                  {`npm run init-db    # Create indexes
npm run seed-db   # Add sample data`}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

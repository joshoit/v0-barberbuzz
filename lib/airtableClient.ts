import Airtable from "airtable"

// Initialize Airtable client
const token = process.env.AIRTABLE_TOKEN
const baseId = process.env.AIRTABLE_BASE_ID

if (!token || !baseId) {
  console.error("Missing Airtable configuration: AIRTABLE_TOKEN or AIRTABLE_BASE_ID")
  throw new Error("Missing required environment variables: AIRTABLE_TOKEN or AIRTABLE_BASE_ID")
}

// Create the Airtable instance with the token
const base = new Airtable({ apiKey: token }).base(baseId)

export { base }

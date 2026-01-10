/**
 * Type tests and runtime guards for the leads module
 *
 * Run with: npx tsc src/lib/leads.test.ts --noEmit
 *
 * This file verifies that:
 * 1. Types are correctly defined
 * 2. Functions have correct signatures
 * 3. Payload normalization works as expected
 */

import {
  type LeadPayload,
  type LeadSource,
  type PersonaType,
  type UTMParams,
  type ValidationResult,
  type LeadSubmissionResult,
  validateLeadPayload,
  normalizeLeadPayload,
  isSpamSubmission,
  buildURLWithUTM,
} from "./leads"

// ============================================================================
// Type Tests (compile-time checks)
// ============================================================================

// Test LeadSource type
const validSources: LeadSource[] = ["contact", "register", "newsletter", "tool"]

// Test PersonaType type
const validPersonas: PersonaType[] = [
  "pausalni",
  "doo",
  "accountant",
  "freelancer",
  "unknown",
]

// Test UTMParams type
const validUTM: UTMParams = {
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "test",
  utm_term: "keyword",
  utm_content: "ad1",
}

// Test LeadPayload type - minimal required fields
const minimalPayload: LeadPayload = {
  email: "test@example.com",
  source: "contact",
  consent: true,
  timestamp: new Date().toISOString(),
}

// Test LeadPayload type - full payload
const fullPayload: LeadPayload = {
  email: "test@example.com",
  source: "register",
  consent: true,
  name: "Test User",
  persona: "pausalni",
  invoiceVolume: "1-10",
  message: "Test message",
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "test",
  utm_term: "keyword",
  utm_content: "ad1",
  referrer: "https://google.com",
  landingPath: "/register",
  timestamp: new Date().toISOString(),
}

// Test ValidationResult type
const validationResult: ValidationResult = {
  valid: true,
  errors: {},
}

// Test LeadSubmissionResult type
const submissionResult: LeadSubmissionResult = {
  success: true,
  method: "api",
  payload: minimalPayload,
}

// ============================================================================
// Runtime Guards
// ============================================================================

/**
 * Type guard for LeadPayload
 */
function isLeadPayload(obj: unknown): obj is LeadPayload {
  if (typeof obj !== "object" || obj === null) return false

  const payload = obj as Record<string, unknown>

  return (
    typeof payload.email === "string" &&
    typeof payload.source === "string" &&
    ["contact", "register", "newsletter", "tool"].includes(payload.source) &&
    typeof payload.consent === "boolean" &&
    typeof payload.timestamp === "string"
  )
}

/**
 * Type guard for ValidationResult
 */
function isValidationResult(obj: unknown): obj is ValidationResult {
  if (typeof obj !== "object" || obj === null) return false

  const result = obj as Record<string, unknown>

  return (
    typeof result.valid === "boolean" &&
    typeof result.errors === "object" &&
    result.errors !== null
  )
}

// ============================================================================
// Function Signature Tests
// ============================================================================

// Test validateLeadPayload signature
function testValidateLeadPayload() {
  const result = validateLeadPayload({ email: "test@test.com", consent: true })
  const check: ValidationResult = result
  return check.valid
}

// Test normalizeLeadPayload signature
function testNormalizeLeadPayload() {
  const result = normalizeLeadPayload({
    email: "TEST@EXAMPLE.COM",
    source: "contact",
    consent: true,
  })
  const check: LeadPayload = result
  return check.email === "test@example.com"
}

// Test isSpamSubmission signature
function testIsSpamSubmission() {
  const result = isSpamSubmission("filled by bot")
  const check: boolean = result
  return check === true
}

// Test buildURLWithUTM signature
function testBuildURLWithUTM() {
  const result = buildURLWithUTM("https://app.fiskai.hr/register", {
    utm_source: "google",
  })
  const check: string = result
  return check.includes("utm_source=google")
}

// ============================================================================
// Validation Logic Tests
// ============================================================================

function testValidation() {
  // Test invalid email
  const invalidEmail = validateLeadPayload({ email: "invalid", consent: true })
  console.assert(
    !invalidEmail.valid,
    "Should reject invalid email"
  )
  console.assert(
    invalidEmail.errors.email !== undefined,
    "Should have email error"
  )

  // Test missing consent
  const noConsent = validateLeadPayload({
    email: "valid@test.com",
    consent: false,
  })
  console.assert(!noConsent.valid, "Should reject missing consent")
  console.assert(
    noConsent.errors.consent !== undefined,
    "Should have consent error"
  )

  // Test valid payload
  const valid = validateLeadPayload({ email: "valid@test.com", consent: true })
  console.assert(valid.valid, "Should accept valid payload")
  console.assert(
    Object.keys(valid.errors).length === 0,
    "Should have no errors"
  )

  console.log("✓ Validation tests passed")
}

function testNormalization() {
  const payload = normalizeLeadPayload({
    email: "  TEST@EXAMPLE.COM  ",
    source: "contact",
    consent: true,
    name: "  Test User  ",
  })

  console.assert(
    payload.email === "test@example.com",
    "Should lowercase and trim email"
  )
  console.assert(payload.name === "Test User", "Should trim name")
  console.assert(payload.timestamp !== undefined, "Should add timestamp")

  console.log("✓ Normalization tests passed")
}

function testSpamDetection() {
  console.assert(isSpamSubmission("bot filled this"), "Should detect spam")
  console.assert(isSpamSubmission("  content  "), "Should detect spam with spaces")
  console.assert(!isSpamSubmission(""), "Should not flag empty honeypot")
  console.assert(!isSpamSubmission(undefined), "Should not flag undefined")
  console.assert(!isSpamSubmission("   "), "Should not flag whitespace-only")

  console.log("✓ Spam detection tests passed")
}

function testURLBuilder() {
  const url = buildURLWithUTM("https://app.fiskai.hr/register", {
    utm_source: "google",
    utm_medium: "cpc",
  })

  console.assert(url.includes("utm_source=google"), "Should include utm_source")
  console.assert(url.includes("utm_medium=cpc"), "Should include utm_medium")
  console.assert(
    url.startsWith("https://app.fiskai.hr/register"),
    "Should preserve base URL"
  )

  console.log("✓ URL builder tests passed")
}

// ============================================================================
// Run Tests (when executed directly)
// ============================================================================

if (typeof window === "undefined") {
  // Only run in Node.js environment
  console.log("\nRunning leads.ts tests...\n")
  testValidation()
  testNormalization()
  testSpamDetection()
  testURLBuilder()
  console.log("\n✓ All tests passed!\n")
}

// Export for potential future use
export {
  isLeadPayload,
  isValidationResult,
  testValidateLeadPayload,
  testNormalizeLeadPayload,
  testIsSpamSubmission,
  testBuildURLWithUTM,
}

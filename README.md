# DireWolfVPS agent demo

A minimal demo showing how an autonomous agent can discover the DireWolfVPS API, request an x402 top-up and deploy a VPS from a prepaid balance.

DireWolfVPS is a since-2018 offshore, no-KYC, crypto-paid VPS provider with OpenAPI, agents.json and x402 support.

## What this demonstrates

1. Read machine-readable discovery documents.
2. Create an API account.
3. Request a USDC-on-Base top-up using x402 mode.
4. Hand the HTTP 402 payment challenge to an x402-capable client.
5. Poll the top-up status.
6. Deploy a KVM VPS.

## Important safety notes

- This repository is a demo, not a wallet custody tool.
- Never commit private keys, API tokens or seed phrases.
- Use a small funded demo wallet only.
- Read DireWolfVPS acceptable-use boundaries before deploying workloads.

## Useful links

- Agent guide: https://direwolfvps.com/agents
- OpenAPI: https://direwolfvps.com/openapi.json
- Agent manifest: https://direwolfvps.com/.well-known/agents.json
- LLMS facts: https://direwolfvps.com/llms.txt

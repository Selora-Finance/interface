'use server';

import * as zod from 'zod';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import {
  SPREADSHEET_ID,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GITHUB_TOKEN,
  ASSETS_REPO_SLUG,
} from '@/environment/server';
import { JWT } from 'google-auth-library';
import { Octokit } from 'octokit';
import { AssetResponseSchema, AssetResponseType } from '@/typings';

// Schemas
const SpreadsheetSubmissionSchema = zod.object({
  email: zod.email().toLowerCase(),
  date: zod.date().optional().default(new Date()),
});

//Authentication
const accountAuth = new JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Sheet
const spreadsheetDocument = new GoogleSpreadsheet(SPREADSHEET_ID, accountAuth);

function loadDocumentInfo() {
  return spreadsheetDocument.loadInfo();
}

function loadSheet() {
  return spreadsheetDocument.sheetsByIndex[0];
}

async function createHeaderValues() {
  const sheet = loadSheet();
  return sheet.setHeaderRow(['Email', 'Date']);
}

async function checkEmailSubmitted(email: string) {
  // Get sheet
  const sheet = loadSheet();
  // Get rows
  const rows = await sheet.getRows();
  // Find row using email address
  const rowFound = rows.find(row => row.get('Email') === email);
  return typeof rowFound !== 'undefined';
}

export async function appendToSpreadsheet(data: zod.infer<typeof SpreadsheetSubmissionSchema>) {
  const { data: parsedValue, error } = SpreadsheetSubmissionSchema.safeParse(data);
  if (error && !parsedValue) return Promise.reject(error);

  const { email, date } = parsedValue;
  // First load document info
  await loadDocumentInfo();
  // Run header creation and email check in parallel
  const [, alreadySubmitted] = await Promise.all([createHeaderValues(), checkEmailSubmitted(email)]);
  if (alreadySubmitted)
    return Promise.reject(new Error('You have already submitted your email address to the waitlist'));
  // Submit
  const sheet = loadSheet();
  const newRow = await sheet.addRow({ Email: email, Date: date.toLocaleString() });
  return newRow.toObject();
}

// Octokit
const octokit = new Octokit({ auth: GITHUB_TOKEN });

export async function getAssetList(chainId: number) {
  // Split slug
  const slug = ASSETS_REPO_SLUG.split('/');
  const repo = slug[0]; // Repository name
  const path = slug.slice(1).join('/').replace('{chainId}', String(chainId));
  const { data } = await octokit.rest.repos.getContent({ repo, path, owner: 'Selora-Finance' });

  if ('content' in data) {
    const asBuffer = Buffer.from(data.content, 'base64');
    const readable = JSON.parse(asBuffer.toString());
    const { data: value, success, error } = AssetResponseSchema.safeParse(readable);

    if (!success) return Promise.reject(error);
    return value as AssetResponseType;
  }

  return [] as AssetResponseType;
}

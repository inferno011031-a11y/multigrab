import { NextRequest, NextResponse } from 'next/server';
import { jobQueue } from '@/core/queue';
import { ApiErrorResponse, JobStatusResponse } from '@/core/types/api';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: jobId } = await params;

  if (!jobId || !/^[a-zA-Z0-9-]+$/.test(jobId)) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INVALID_JOB_ID',
        message: 'Invalid job ID format.',
      },
    };
    return NextResponse.json(errorBody, { status: 400 });
  }

  const job = await jobQueue.getJob(jobId);

  if (!job) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: 'JOB_NOT_FOUND',
        message: 'The requested job was not found or has expired.',
      },
    };
    return NextResponse.json(errorBody, { status: 404 });
  }

  const responseBody: JobStatusResponse = {
    success: true,
    data: job,
    meta: {
      timestamp: Date.now(),
    },
  };

  return NextResponse.json(responseBody, { status: 200 });
}

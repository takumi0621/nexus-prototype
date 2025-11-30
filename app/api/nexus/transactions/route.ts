import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})

type InsertBody = {
  hostClientId?: string | null
  hostName?: string | null
  carName?: string
  deposit?: number
  startDate?: string | null
  endDate?: string | null
}

// 取引を追加（借り手が保証金ロックしたとき）
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InsertBody

    if (!body.carName || typeof body.deposit !== 'number') {
      return NextResponse.json(
        { ok: false, error: 'carName と deposit は必須です' },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from('nexus_transactions')
      .insert({
        host_client_id: body.hostClientId ?? null,
        host_name: body.hostName ?? null,
        car_name: body.carName,
        deposit: body.deposit,
        start_date: body.startDate ?? null,
        end_date: body.endDate ?? null,
        status: 'locked',
      })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ ok: true, transaction: data }, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/nexus/transactions error', err)
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Unexpected error' },
      { status: 500 },
    )
  }
}

// 取引一覧を取得（ホスト用画面）
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('nexus_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ ok: true, transactions: data ?? [] })
  } catch (err: any) {
    console.error('GET /api/nexus/transactions error', err)
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Unexpected error' },
      { status: 500 },
    )
  }
}

import type { Env } from '../env';
import { requireBearerToken } from '../lib/auth';
import { errorJson, json } from '../lib/http';
import type { McpServerHandle, McpToolDefinition } from './types';

export function createMcpServer(config: { name: string; tools: McpToolDefinition[] }): McpServerHandle {
  return { async fetch(request: Request, env: Env): Promise<Response> {
    const denied = requireBearerToken(request, env); if (denied) return denied;
    const body = await request.json().catch(() => null) as any; if (!body) return errorJson('JSON-RPC ไม่ถูกต้อง');
    if (body.method === 'initialize') return json({ jsonrpc: '2.0', id: body.id, result: { protocolVersion: '2025-03-26', capabilities: { tools: {} }, serverInfo: { name: config.name, version: '1.0.0' } } });
    if (body.method === 'notifications/initialized') return new Response(null, { status: 202 });
    if (body.method === 'tools/list') return json({ jsonrpc: '2.0', id: body.id, result: { tools: config.tools.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })) } });
    if (body.method === 'tools/call') {
      const tool = config.tools.find((candidate) => candidate.name === body.params?.name);
      if (!tool) return json({ jsonrpc: '2.0', id: body.id, error: { code: -32602, message: 'ไม่พบ tool' } });
      try { const value = await tool.handler(body.params?.arguments || {}, env); return json({ jsonrpc: '2.0', id: body.id, result: { content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value) }] } }); }
      catch (error) { return json({ jsonrpc: '2.0', id: body.id, result: { isError: true, content: [{ type: 'text', text: error instanceof Error ? error.message : 'เกิดข้อผิดพลาด' }] } }); }
    }
    return json({ jsonrpc: '2.0', id: body.id, error: { code: -32601, message: 'ไม่รองรับ method' } }, 404);
  } };
}
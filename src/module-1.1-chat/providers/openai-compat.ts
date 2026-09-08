import type { ChatMessage, McpTool, ToolCaller, ToolTraceEntry } from '../types';
import { toolFunctionName } from '../types';
export async function runOpenAiCompatConversation(p: { baseUrl: string; apiKey: string; model: string; systemPrompt: string; history: ChatMessage[]; tools: McpTool[]; callTool: ToolCaller }): Promise<{ reply: string; toolTrace: ToolTraceEntry[] }> {
  if (!p.apiKey || !p.baseUrl) return { reply: 'ยังไม่ได้ตั้งค่า API key หรือ base URL ของ provider นี้', toolTrace: [] };
  const messages: any[] = [{ role: 'system', content: p.systemPrompt }, ...p.history]; const trace: ToolTraceEntry[] = [];
  for (let round = 0; round < 4; round++) {
    const response = await fetch(`${p.baseUrl.replace(/\/$/, '')}/chat/completions`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${p.apiKey}` }, body: JSON.stringify({ model: p.model, messages, tools: p.tools.map(t => ({ type: 'function', function: { name: toolFunctionName(t.serverId, t.name), description: t.description, parameters: t.inputSchema } })), tool_choice: p.tools.length ? 'auto' : undefined }) });
    if (!response.ok) throw new Error(`AI provider ตอบกลับ ${response.status}: ${await response.text()}`);
    const data: any = await response.json(); const choice = data.choices?.[0]; const message = choice?.message;
    if (!message?.tool_calls?.length) return { reply: message?.content || 'ไม่ได้รับข้อความตอบกลับ', toolTrace: trace };
    messages.push(message);
    for (const call of message.tool_calls) { const [serverId, ...parts] = String(call.function.name).split('__'); const name = parts.join('__'); let args: unknown = {}; try { args = JSON.parse(call.function.arguments || '{}'); } catch {}
      const output = await p.callTool(serverId, name, args); trace.push({ serverId, toolName: name, input: args, output }); messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(output) }); }
  }
  return { reply: 'การเรียกใช้เครื่องมือเกินจำนวนรอบที่กำหนด', toolTrace: trace };
}
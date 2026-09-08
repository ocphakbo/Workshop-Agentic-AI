import type { Env } from '../env';
export type McpToolDefinition = { name:string; description?:string; inputSchema:Record<string,unknown>; handler:(args:any,env:Env)=>Promise<unknown>|unknown };
export type McpServerHandle = { fetch:(request:Request,env:Env)=>Promise<Response> };
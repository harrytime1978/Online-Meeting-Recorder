const {contextBridge,ipcRenderer}=require('electron');
const channels=['sources','source:set','archive:list','archive:create','archive:update','archive:delete','archive:open','archive:folder','archive:export','record:begin','record:append','record:end','key:exists','key:set','ai:process','ai:live'];
contextBridge.exposeInMainWorld('desktop',Object.fromEntries(channels.map(k=>[k,(...args)=>ipcRenderer.invoke(k,...args)])));

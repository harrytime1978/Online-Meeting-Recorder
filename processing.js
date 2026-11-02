const fs=require('fs'),os=require('os'),path=require('path');
const {spawn}=require('child_process');
function timeOf(i,seconds=480){return i*seconds}
function ffmpegPath(){try{return require('ffmpeg-static')}catch{return process.env.FFMPEG_PATH||'ffmpeg'}}
function runFfmpeg(args){return new Promise((resolve,reject)=>{const child=spawn(ffmpegPath(),args,{windowsHide:true});let stderr='';child.stderr.on('data',d=>{stderr=(stderr+d.toString()).slice(-6000)});child.on('error',reject);child.on('close',c=>c===0?resolve():reject(Error('FFmpeg failed: '+stderr.slice(-800))))})}
async function splitAudio(input){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'meeting-chunks-'));try{const output=path.join(dir,'chunk-%04d.webm');await runFfmpeg(['-hide_banner','-loglevel','error','-i',input,'-vn','-ac','1','-ar','16000','-c:a','libopus','-b:a','24k','-f','segment','-segment_time','480','-reset_timestamps','1',output]);let files=fs.readdirSync(dir).filter(f=>f.endsWith('.webm')).sort().map(f=>path.join(dir,f));if(!files.length)throw Error('No audio chunks created');return {dir,files}}catch(e){fs.rmSync(dir,{recursive:true,force:true});throw e}}
function transcriptParts(parts){return parts.map(p=>p.text||'').filter(Boolean).join('\n')}
module.exports={splitAudio,runFfmpeg,timeOf,transcriptParts};

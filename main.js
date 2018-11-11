dict={
    '+':'++*ptr',
    '-':'--*ptr',
    '>':'++ptr',
    '<':'--ptr',
    ',':'*ptr=getchar()',
    '.':'putchar(ptr)',
    '[':'while(*ptr){',
    ']':'}',
}
window.onload=async ()=>{
    document.getElementById('emulate').onclick=async ()=>{
        document.getElementById('run').style.display='block'
        var bf_code=document.getElementById('brainfuck_code').value
        var c_node=document.getElementById('c_code')
        c_node.innerHTML=''
        let indent=0
        brc=Array(bf_code.length)
        brk=[...Array(bf_code.length)].map(_=>false)
        brc_stack=Array()
        brk[1]=true
        let length=1,ptr=0
        let line_nodes=[]
        for(let i=0;i<bf_code.length;i++){
            let line_num=document.createElement('td')
            line_num.innerText=(i)
            let line_code=document.createElement('td')
            if(bf_code[i]===']'){
                indent--
                let j=brc_stack.pop()
                brc[i]=j
                brc[j]=i
            }
            line_code.innerHTML=('&nbsp'.repeat(indent*4)+dict[bf_code[i]])
            if(bf_code[i]==='['){
                indent++
                brc_stack.push(i)
            }
            if(bf_code[i]==='>')ptr++
            if(bf_code[i]==='<')ptr--
            length=Math.max(length,ptr+1)
            let line=document.createElement('tr')
            line_nodes.push(line)
            line.onclick=_=>{
                if(brk[i]){
                    unbreakFunc(i);
                }
                else{
                    breakFunc(i);
                }
            }
            line.appendChild(line_num)
            line.appendChild(line_code)
            document.getElementById('c_code').appendChild(line)
        }
        document.getElementById('run').onclick=async _=>{
            document.getElementById('continue').style.display='block'
            document.getElementById('step').style.display='block'
            let memory=[...Array(length)].map(_=>0)
            let memoryContainer=document.getElementById('memory')
            memoryNodeList=[]
            for(let i=0;i<length;i++){
                let memoryNode=document.createElement('input')
                memoryNode.type='input'
                memoryContainer.appendChild(memoryNode)
                memoryNodeList.push(memoryNode)
            }
            let rip=0, read_offset=0
            ptr=0
            input=document.getElementById('input').value
            output=''
            behave={
                '>':_=>ptr++,
                '<':_=>ptr--,
                '+':_=>memory[ptr]++,
                '-':_=>memory[ptr]--,
                ',':_=>memory[ptr]=input.charCodeAt(read_offset++),
                '.':_=>output=output+String.fromCharCode(memory[ptr]),
                '[':_=>(memory[ptr]==0)?(rip=brc[rip]):{},
                ']':_=>{rip=brc[rip]-1},
            }
            while(rip<bf_code.length){
                behave[bf_code[rip]]()
                while(memory[ptr]<0)memory[ptr]+=256
                if(brk[rip]==true){
                    line_nodes[rip].style.color='red'
                    for(let i=0;i<length;i++){
                        memoryNodeList[i].value=memory[i]
                        memoryNodeList[i].style.color='black'
                    }
                        memoryNodeList[ptr].style.color='red'
                    await new Promise((res,rej)=>{
                        document.getElementById('continue').onclick=()=>{res()}
                        document.getElementById('step').onclick=()=>{breakFunc(rip+1);res()}
                    })
                    unbreakFunc(rip)
                }
                rip++
            }
            console.log(output)
        }
        function breakFunc(linenum){
            line_nodes[linenum].style.backgroundColor='black'
            line_nodes[linenum].style.color='white'
            brk[linenum]=true
        }
        function unbreakFunc(linenum){
            line_nodes[linenum].style.backgroundColor='white'
            line_nodes[linenum].style.color='black'
            brk[linenum]=false
        }
    }
}

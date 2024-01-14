var offset = 0;
var code_orig = new Array();

window.addEventListener("load", () =>
{
    let btn_flat = document.getElementById("flat");
    if(btn_flat != null)
    {
        btn_flat.addEventListener('click', flat);
    }

    let btn_sharp = document.getElementById("sharp");
    if(btn_sharp != null)
    {
        btn_sharp.addEventListener('click', sharp);
    }

    let trans_list = document.getElementsByClassName("trans");
    for(let i = 0; i < trans_list.length; i++)
    {
        trans_list[i].addEventListener('click', () => { set(trans_list[i].getAttribute("value")); });
    }

    reload();
});

export function reload()
{
    offset = 0;
    code_orig.length = 0;

    let code_list = document.getElementsByTagName("code");
    for(let i = 0; i < code_list.length; i++)
    {
        let key = code_list[i].textContent.replace("b", "♭").replace("#", "♯");
        code_list[i].textContent = key;
        code_orig.push(key);
    }

    let ofs = document.getElementById("offset");
    if(ofs != null)
    {
        ofs.innerText = offset;
    }
}

function set(key)
{
    let ofs = Number(key);
    if(ofs != NaN && -6 <= ofs && ofs <= 6)
    {
        offset = ofs;
        replace();
    }
}
function flat()
{
    if(-6 < offset)
    {
        offset--;
        replace();
    }
}

function sharp()
{
    if(offset < 6)
    {
        offset++
        replace();
    }
}

function replace()
{
    let code_list = document.getElementsByTagName("code");

    if(code_orig == undefined)
    {
        code_orig = new Array(code_list.length);
        for(let i = 0; i < code_list.length; i++)
        {
            let key = code_list[i].textContent.replace("b", "♭").replace("#", "♯");
            code_list[i].textContent = key;
            code_orig[i] = key;
            code_orig[i] = code_list[i].textContent;
        }
    }

    for(let i = 0; i < code_list.length; i++)
    {
        let regex = /[A-G][♭♯]?/g;
        code_list[i].textContent = code_orig[i].replace(regex, replacement);
    }

    let ofs = document.getElementById("offset");
    if(ofs != null)
    {
        if(0 < offset)
        {
            ofs.innerText = "+" + offset;
        }
        else if(offset == 0)
        {
            ofs.innerText = " " + offset;
        }
        else
        {
            ofs.innerText = offset;
        }
    }
 }

function replacement(match, pos, group)
{
    const code_tbl_1 = ["A", "B♭", "B", "C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭"];
    const code_tbl_2 = ["A", "A♯", "B", "C", "D♭", "D", "D♯", "E", "F", "G♭", "G", "G♯"];

    let index = code_tbl_1.indexOf(match);
    if(index < 0)
    {
        index = code_tbl_2.indexOf(match);
    }

    if(index < 0)
    {
        return "?";
    }

    index += code_tbl_1.length;

    const code = String(match);
    if(code.includes("♭"))
    {
        index--;
    }
    if(code.includes("♯"))
    {
        index++;
    }
    index += offset;
    index %= code_tbl_1.length;
    return code_tbl_1[index];
}

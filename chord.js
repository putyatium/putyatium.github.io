var offset = 0;
var code_orig = new Array();

window.addEventListener("load", () =>
{
    let code_list = document.getElementsByTagName("code");
    for(let i = 0; i < code_list.length; i++)
    {
        let key = code_list[i].textContent.replace("b", "♭").replace("#", "♯");
        code_list[i].textContent = key;
        code_orig.push(key);
    }

    let ctrl = document.createElement("div");
    ctrl.style.float = "right";
    for(let i = -6; i <= 6; i++)
    {
        ctrl.appendChild(createButton(i));
    }
    document.body.prepend(ctrl);
    refleshButtons();
});

function createButton(val)
{
    let button = document.createElement("button");
    button.value = val;
    if(val <= 0)
    {
        button.textContent = val;
    }
    else
    {
        button.textContent = "+" + val;
    }
    button.onclick = () => { set(val); };
    return button;
}

function refleshButtons()
{
    let button_list = document.getElementsByTagName("button");

    for(let i = 0; i < button_list.length; i++)
    {
        if(button_list[i].value == offset)
        {
            button_list[i].classList.add("active");
        }
        else
        {
            button_list[i].classList.remove("active");
        }
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

    let summary = document.getElementById("summary");
    if(summary != null)
    {
        summary.textContent = offset;
    }

    refleshButtons();
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

val = document.getElementById("val")
val.addEventListener("input", iferror)
function iferror() {
    val = document.getElementById("val").value;
    main_div = document.getElementById("input-matrix-container");
    main_div.innerHTML = "";
    error = document.getElementById("error");
    error.innerHTML = ""
    if (val <= 0) {
        error.textContent = "Order of the matrix cannot be less than or equal to 0";
        error.style.color = "red";
    }
    else {
        create_matrix()
    }

}

function decompose() {
    main_div = document.getElementById("main-div");
    main_div.innerHTML = "";
    for (m = 1; m < val; m++) {
        main_div = document.getElementById("main-div");
        for (k = 1; k <= (val); k++) {
            const br = document.createElement("br")
            main_div.appendChild(br)
            for (l = 1; l <= (val); l++) {
                const input2 = document.createElement("input");
                input2.setAttribute("class", "input-tags");
                input2.readOnly = true
                input2.setAttribute("id", `e${m}inpp${k}${l}`);
                input2.setAttribute("type", "number");
                if (k == l) {
                    input2.value = 1
                }
                else {
                    input2.value = 0
                }
                main_div.appendChild(input2);

                document.body.appendChild(main_div);
            }


        }
        const br = document.createElement("br")
        main_div.appendChild(br)
        document.body.appendChild(main_div);
        for (n = (m + 1); n <= val; n++) {
            a = document.getElementById(`inp${m}${m}`).value;
            b = document.getElementById(`inp${n}${m}`).value;
            if (b != 0) {
                document.getElementById(`e${m}inpp${n}${m}`).value = -a / b;
            }
        }
    }
    // multiply_elim_inp_matrix()
}




// Incomplete Function
function multiply_elim_inp_matrix() {
    alert("Hello! Dilip  Suthar")
    new_dict = {}
    // m1=0
    // for (o=0;o<val;o++){
    console.log(list_main)
    for (p = 0; p < (list_main.length - 1); p++) {
        lst1 = Object.keys(list_main[p])
        lst2 = Object.keys(list_main[p + 1])
        for (q = 0; q < lst1.length; q++) {
            result = list_main[p][lst1[q]] * list_main[p + 1][lst2[q]]
            console.log("here")
            console.log(result)
        }
    }
}



function create_matrix() {
    val = document.getElementById("val").value;
    i_m_c = document.getElementById("input-matrix-container");
    main_div = document.getElementById("main-div");
    i_m_c.innerHTML = "";
    main_div.innerHTML = "";
    console.log("Cleared")
    for (i = 1; i <= (val); i++) {
        const br = document.createElement("br")
        i_m_c.appendChild(br)
        document.body.appendChild(i_m_c);
        for (j = 1; j <= (val); j++) {
            const input1 = document.createElement("input");
            input1.style.backgroundColor = "white";
            input1.style.borderColor = "black";
            input1.style.borderWidth = "1px";
            input1.setAttribute("id", `inp${i}${j}`);
            input1.setAttribute("class", "input-tags");
            input1.setAttribute("type", "number");
            i_m_c.appendChild(input1);
            document.body.appendChild(i_m_c);

        }
    }
    if (val >= 3) {
        const br = document.createElement("br");
        i_m_c.appendChild(br);
        const br1 = document.createElement("br");
        i_m_c.appendChild(br1);
        const decompose_button = document.createElement("button");
        decompose_button.textContent = "Decompose";
        decompose_button.setAttribute("id", "btn-decompose");
        decompose_button.onclick = decompose;
        i_m_c.appendChild(decompose_button);
        document.body.appendChild(i_m_c);
    }

}
import './scss/style.scss'

const inputData = document.querySelector(" form input");
const myForm = document.querySelector("#myForm");
const urlList = document.querySelector(".url__list");


//SHOW ERROR MESSAGE//
const invalidMsg = () => {
    const errorMsg = document.querySelector(".error__msg");
    myForm.addEventListener('submit', () => {
        if (inputData.value === '') {
            errorMsg.style.display = 'block';
            inputData.style.border = '5px solid var(--red)'
        } else {
            errorMsg.style.display = 'none'
            inputData.style.border = 'none'
        }    
    })
}
invalidMsg();

//SAVE SHRTCODE LINKS TO LOCAL STORAGE//
function saveUrl() {
     let elements = urlList.innerHTML
    localStorage.setItem('genLink', JSON.stringify(elements))
}

const copyLink = () => {
    const copyBtn = document.querySelectorAll(".copybtn");
    const genLink = document.querySelector(".shrtcode__link").textContent;
    copyBtn.forEach((btn) => {
        btn.addEventListener('click', (e) => {

            navigator.clipboard.writeText(genLink).then(() => {
                e.target.textContent ='Copied!'
                e.target.style.backgroundColor = 'var(--vd-blue)' 


                //REMOVE URL FROM BROWSER//
                let urlRemove = e.target.parentElement.parentElement;

                setTimeout(() => {
                    urlRemove.remove()
                    saveUrl();
                }, 2000);
            })
        })
    })
}

//INTEGRATE SHRTCODE API//
const shortener = async () => {
    const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${inputData.value}`)
    const data = await response.json();
    let ourHTML = `<li>
    <div class='url__link'>${data.result.original_link}</div> 
    <div class='shrtcode'>
    <div class='shrtcode__link'>${data.result.full_short_link}</div>
    <button class= 'copybtn'>Copy</button>
    </div>
    </li>`

    urlList.insertAdjacentHTML('beforeend', ourHTML);

    saveUrl();

    copyLink();
}

//SUBMIT URL LINK TO CREATE LIST//
const createList = () => {
    myForm.addEventListener('submit', function(e) {
        e.preventDefault()

        if(inputData.value.length > 0) {
            shortener();
            urlList.style.display = 'block';
            inputData.focus();
            inputData.value = ''
        } else {
            e.preventDefault()
        }
    })    
} 
createList();

//LOAD SHRTCODE LINKS AFTER REFRSHING BROWSER//
window.addEventListener('load', () => {
    urlList.style.display = 'block'
    let elements = JSON.parse(localStorage.getItem('genLink'))
    urlList.innerHTML = elements
    copyLink();
})














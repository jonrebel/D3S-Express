const select = document.querySelector("#service");
const radio = document.querySelector("#yes");
const radio1 = document.querySelector("#no");
const other = document.querySelector(".if-other");
const yes = document.querySelector(".if-yes"); 

// Add event listeners
select.addEventListener('change', ifOther);
radio.addEventListener('change', ifYes);
radio1.addEventListener('change', ifNo);

// Function to handle 'other' selection
function ifOther() {
    if (select.value === 'other') {
        other.classList.remove('if-other');
    } else {
        other.classList.add('if-other'); 
 }
}

// Function to handle 'yes' radio button 
function ifYes() {
    if (radio.checked) {
        yes.classList.remove('if-yes');
        console.log("yes");
    }
}

// Function to handle 'no' radion button
function ifNo() {
    if (radio1.checked) {
        yes.classList.add('if-yes')
        console.log('no')
    }
} 

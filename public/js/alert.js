document.querySelectorAll('.alert').forEach(alert=>{

    // Auto remove after 5 seconds
    setTimeout(()=>{

        alert.classList.add('fade-out');

        setTimeout(()=>{

            alert.remove();

        },350);

    },5000);

});

document.querySelectorAll('.close-alert').forEach(button=>{

    button.addEventListener('click',()=>{

        const alert=button.parentElement;

        alert.classList.add('fade-out');

        setTimeout(()=>{

            alert.remove();

        },350);

    });

});

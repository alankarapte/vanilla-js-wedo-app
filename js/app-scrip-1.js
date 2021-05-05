document.getElementById("feedback-button").addEventListener("click", (e) => {
    if (validateFeedbackForm()) {
        submitFeedback();
    }
});

function submitFeedback() {

    var feedbackData = feedbackCreateModel(
        document.getElementById("feedback-name").value,
        document.getElementById("feedback-data").value
    );

    firebase.firestore().collection("feedback/").add(feedbackData).then(() => {

        Swal.fire(
            'Thanks you!',
            'Feedback submitted!',
            'success'
        )
    });
    document.getElementById("feedback-data").value = '';
    document.getElementById("feedback-name").value = '';
}

//individual validation i.e check validation feedback Name input
document.getElementById("feedback-name").addEventListener("input", () => {
    let feedBackName = document.getElementById("feedback-name");
    if (feedBackName.value.trim() === "") {
        feedBackName.classList.add("is-invalid");
    } else {
        feedBackName.classList.remove("is-invalid");
    }
})

//individual validation i.e check validation feedback Name data input
document.getElementById("feedback-data").addEventListener("input", () => {
    let feedBackData = document.getElementById("feedback-data");
    if (feedBackData.value.trim() === "") {
        feedBackData.classList.add("is-invalid");
    } else {
        feedBackData.classList.remove("is-invalid");
    }
})

//universal validation i.e check validation for all inputs of feedback form
function validateFeedbackForm() {
    let isFeedBackFormValid = true;
    let feedBackData = document.getElementById("feedback-data");
    let feedBackName = document.getElementById("feedback-name");

    if (feedBackData.value.trim() == '') {
        feedBackData.classList.add("is-invalid");
        isFeedBackFormValid = false;
    }
    if (feedBackName.value.trim() == '') {
        feedBackName.classList.add("is-invalid");
        isFeedBackFormValid = false;
    }
    if (isFeedBackFormValid) {
        feedBackName.classList.remove("is-invalid");
        feedBackName.classList.remove("is-invalid");
        return isFeedBackFormValid;
    }
    return isFeedBackFormValid;
}

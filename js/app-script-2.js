
//individual validation i.e check validation task title input
document.getElementById("task-title").addEventListener("input", () => {
    let taskInput = document.getElementById("task-title");
    if (taskInput.value.trim() === "") {
        taskInput.classList.add("is-invalid");
    } else {
        taskInput.classList.remove("is-invalid");
    }
})

//individual validation i.e check validation task description input
document.getElementById("description").addEventListener("input", () => {
    let descriptionInput = document.getElementById("description");
    if (descriptionInput.value.trim() === "") {
        descriptionInput.classList.add("is-invalid");
    } else {
        descriptionInput.classList.remove("is-invalid");
    }
})

//universal validation i.e check validation for all inputs of task form
function validateTaskForm(isForcedValid = false) {

    let isTaskFormValid = true;
    let taskInput = document.getElementById("task-title");
    let descriptionInput = document.getElementById("description");

    if (taskInput.value.trim() == '') {
        taskInput.classList.add("is-invalid");
        isTaskFormValid = false;
    }
    if (descriptionInput.value.trim() == '') {
        descriptionInput.classList.add("is-invalid");
        isTaskFormValid = false;
    }
    if (isTaskFormValid || isForcedValid) {
        taskInput.classList.remove("is-invalid");
        descriptionInput.classList.remove("is-invalid");
        return isTaskFormValid;
    }
    return isTaskFormValid;

}


function reset() {
    validateTaskForm(true);
    document.getElementById("task-title").value = "";
    document.getElementById("description").value = "";
    //add
    document.getElementById("button-create").style.display = "inline-block";
    //update
    document.getElementById("button-update").style.display = "none";
}



//create button - event listener
document.getElementById("button-create").addEventListener("click", (e) => {

    if (validateTaskForm()) {
        var title = document.getElementById("task-title").value;
        var description = document.getElementById("description").value;
        createTask(title, description);
    }

});

//refresh button - event listener
document.getElementById("button-refresh").addEventListener("click", (e) => {
    reset();
    readTask();
});

//Models: we are using factory methods instead classes or constructor methods, because...

/*while firebase could send the data inside your object to the database, 
when the data comss back it cannot instantiate it back into an instance of your class. 
Therefore classes are disallowed*/

/*FirebaseError: [code=invalid-argument]: Function DocumentReference.set() called with invalid data. 
Data must be an object, 
but it was: a custom Sponsor object*/

//Factory methods for Task model 
function taskCreateModel(title, description, createdDate, createdBy) {
    return {
        title: title,
        description: description,
        createdDate: createdDate,
        updatedDate: null,
        createdBy: createdBy,
        status: "A"
    }
}

function taskUpdateModel(title, description, updatedDate) {
    return {
        title: title,
        description: description,
        updatedDate: updatedDate
    }
}
function taskDeleteModel(activeStatus) {
    return {
        status: activeStatus
    }
}

//Feedback model: constructor method
function feedbackCreateModel(name, feedback) {
    return {
        name: name,
        feedback: feedback
    }
}


function createTask(title, description) {
    var task = taskCreateModel(title, description, new Date(), user.email)

    firebase.firestore().collection("task/").add(task).then(() => {
        Swal.fire(
            'Hurrray!',
            'Task Added!',
            'success'
        )
        readTask();
        reset();
    })
}

function readTask() {
    firebase.firestore().collection("task").onSnapshot((snapshot) => {
        document.getElementById("cardsection").innerHTML = "";
        snapshot.forEach((taskValue) => {
            if (taskValue.data().status == "A") {
                let createdBy = taskValue.data().createdBy;
                let createdDate = taskValue.data().createdDate.toDate();
                let updatedDate = taskValue.data().updatedDate;
                let updateBefore = "";

                let createdDateAsLocalString = createdDate.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                console.log(updatedDate);

                if (updatedDate == null) {
                    updateBefore = "Never";
                } else {
                    let dateDifference = new Date().getTime() - updatedDate.toDate().getTime();
                    let updateBeforeDays = Math.floor(dateDifference / (1000 * 60 * 60 * 24));


                    if (updateBeforeDays > 0) {
                        updateBefore = updateBeforeDays.toString() + " days ago";
                    }
                    else {
                        if (Math.floor(dateDifference / (1000 * 60 * 60)) > 0) {
                            updateBefore = Math.floor(dateDifference / (1000 * 60 * 60)).toString() + " hours ago";
                        }
                        else {
                            if (Math.floor(dateDifference / (1000 * 60)) > 0) {
                                updateBefore = Math.floor(dateDifference / (1000 * 60)).toString() + " min ago";
                            }
                            else {
                                updateBefore = Math.floor(dateDifference / (1000)).toString() + " sec ago";
                            }
                        }
                    }
                }

                let StringOfUpdateDeleteButton = "";
                if (user.email == createdBy) {
                    createdBy = "You";
                    StringOfUpdateDeleteButton =
                        `
                        <button type="submit" style="color:white;" class="btn btn-warning" 
                                onclick="update('${taskValue.id}')">
                            <i class="fas fa-edit"></i> Edit Task
                        </button>
                        <button type="submit" style="color:white;" class="btn btn-danger" 
                                onclick="deleteTask('${taskValue.id}')">
                            <i class="fas fa-trash"></i> Delete Task
                        </button>
                    `;
                }


                document.getElementById("cardsection").innerHTML +=
                    `
                        <div class="card mb-3">
                            <div class="card-body">

                                <div class="card-title ">
                                    <strong class="">${taskValue.data().title}</strong>
                                    <div class="float-right">
                                        <p class="small font-weight-lighter m-0">Created: ${createdDateAsLocalString}</p>
                                        <p class="small font-weight-lighter m-0">Updated: ${updateBefore}</p>
                                    </div>
                                </div>

                                <p class="card-text">${taskValue.data().description}</p>
                                ${StringOfUpdateDeleteButton}
                                <p class="small mt-2 mb-0 "><b>By:</b> ${createdBy}</p>
                            </div>
                        </div>
                        `

            }
        });

    });
}



let updateId = "";

function update(id) {

    mydb.collection("task").doc(id).get()
        .then(function (doc) {
            if (doc.exists) {
                document.getElementById("task-title").value = doc.data().title;
                document.getElementById("description").value = doc.data().description;
                updateId = id;
                //add
                document.getElementById("button-create").style.display = "none";
                //update
                document.getElementById("button-update").style.display = "inline-block";


                document.getElementById("task-title").focus();
            } else {
                // doc.data() will be undefined in this case
                console.log("document not found for update!");
            }
        })
        .catch(function (error) {
            console.log("Error getting document:", error);
        });


}

document.getElementById("button-update").addEventListener("click", () => {

    if (validateTaskForm()) {
        //checking if record is present with given id or not
        firebase.firestore().collection("task").onSnapshot((snapshot) => {
            snapshot.forEach((taskValue) => {
                if (updateId == taskValue.id) {
                    //if id is present i.e. (record present) then proceed to updateTask
                    updateTask(updateId, document.getElementById("task-title").value, document.getElementById("description").value);
                    updateId = "";
                }
            })
        })
    }

});

function updateTask(id, title, description) {
    var updatedTask = taskUpdateModel(title, description, new Date());
    firebase.firestore().collection("task").doc(id).update(updatedTask).then(() => {
        Swal.fire(
            'Hurrray!',
            'Task Updated',
            'success'
        );
    });
    readTask();
    reset();
}

function deleteTask(id) {
    var deletedTask = taskDeleteModel("I");
    firebase.firestore().collection("task").doc(id).update(deletedTask).then(() => {
        Swal.fire(
            'Hurrray!',
            'Task Remove',
            'success'
        );
    });
    reset();
    document.getElementById("cardsection").innerHTML = '';
    readTask();
}
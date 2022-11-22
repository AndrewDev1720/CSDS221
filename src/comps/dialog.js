// Import react
import React, { useState, useEffect } from 'react';

//Import from library
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

//Import components
import DateTime from './dateTime';
import { TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import toastr from 'toastr';

// Export function
export default function ResponsiveDialog(props) {
    //variables
    const [type] = useState(props.type) 
    let [rows] = useState(props.rowFromParent)
    const [priority, setPriority] = useState(isEmpty(rows) || props.index === -1 ? null : rows[props.index].priority)
    const [checked, setChecked] = useState(isEmpty(rows) || props.index === -1 ? null : rows[props.index].checked)
    const [deadline, setDeadLine] = useState(isEmpty(rows) || props.index === -1 ? null : rows[props.index].deadline);
    const [title, setTitle] = useState(isEmpty(rows) || props.index === -1 ? null : rows[props.index].title)
    const [description, setDescription] = useState(isEmpty(rows) || props.index === -1 ? null : rows[props.index].description)
   

    // Check empty object boolean
    function isEmpty(obj) {
        return !obj || obj.length === 0 || Object.keys(obj).length === 0;
    }

    // Cancel function
    let cancel = () => {
        props.parentCallback({
            action: 'cancel',
            data: {}
        });
    };

    // Add a new task
    let submitAddTask = () => {
        if (title !== null && title !== "" && !checkDuplicate(title) && description !== null && description !== "" && priority !== "" && deadline) {
            props.parentCallback({
                action: 'submit',
                data: { title: title, description: description, deadline: deadline, priority: priority, checked: checked, setChecked: setChecked }
            });
        }
        if(title === null || title === ""){
            toastr.error(`Title must not be empty!`, ``, { 'closeButton': true, positionClass: 'toast-bottom-right' });
        }
        if(description === null || description === ""){
            toastr.error(`Description must not be empty!`, ``, { 'closeButton': true, positionClass: 'toast-bottom-right' });
        }
    };

    // Edit an existing task
    let updateTask = () => {
        if (description !== null && description !== "" && priority !== "" && deadline) {
            props.parentCallback({
                action: 'edit',
                data: { title: title, description: description, deadline: deadline, priority: priority, checked: checked, setChecked: setChecked },
                index: props.index
            });
        }
        if(description === null || description === ""){
            toastr.error(`Description must not be empty!`, ``, { 'closeButton': true, positionClass: 'toast-bottom-right' });
        }
    };

    // Check duplicate
    let checkDuplicate = (text) => {
        for(let i = 0; i < rows.length; i++) {
            if(rows[i].title === text) {
                return true
            }
        }
        
        return false
    }

    //Show warning text for title
    let displayTitleHelperText = (title) => {
        if(title === "") {
            return "Title is Required!"
        }
        else if(checkDuplicate(title)) {
            return "Title already Existed!"
        }
        else {
            return ""
        }
    }

    //Show warning text for description
    let displayDescriptionHelperText = (title) => {
        if(description === "" || description === null) {
            return "Description is Required!"
        }
        else {
            return ""
        }
    }

    return (
        <>
            {/*Title*/}
            {type === "add" ? <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
                <i className="fa fa-fw fa-plus-circle"></i>Add Task
            </DialogTitle> : <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
                <i className="fa fa-fw fa-edit-circle"></i>Edit Task
            </DialogTitle>}
            {/*Task ticket headlines*/}
            <DialogContent>
                <br /><br />
                {type === "add" ? 
                <TextField
                    error={type === "add" ? (title === "" || checkDuplicate(title)) : false}
                    id="title"
                    label="Title"
                    helperText={displayTitleHelperText(title)}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                /> : null}

                <br /><br /><br />

                <TextField
                    error={type === "add" ? description === "" : false}
                    id="description"
                    label="Description"
                    helperText= {displayDescriptionHelperText(description)}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/*Deadline*/}
                <br /><br /><br />
                <DateTime dataFromParent={deadline} dataToParent={setDeadLine} />

                <br /><br /><br />

                <FormControl>
                {/*Priority*/}
                    <FormLabel id="demo-row-radio-buttons-group-label">Priority</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="priority"
                        name="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <FormControlLabel value="low" control={<Radio />} label="Low" />
                        <FormControlLabel value="med" control={<Radio />} label="Med" />
                        <FormControlLabel value="high" control={<Radio />} label="High" />
                    </RadioGroup>
                </FormControl>

            </DialogContent>
            {/*Buttons*/}
            <DialogActions sx={{ bgcolor: 'white' }}>
                {/*Cancel button*/}
                {type === 'add' ? <Button onClick={submitAddTask} variant="contained" sx={{ width: 100, marginRight: '7px' }}>
                    <i className="fa fa-fw fa-plus-circle"></i>Add
                </Button> : <Button onClick={updateTask} variant="contained" sx={{ width: 100, marginRight: '7px' }}>
                    <i className="fa fa-fw fa-edit-circle"></i>Edit
                </Button>}

                <Button onClick={cancel} variant="contained" color='error' sx={{ bgcolor: '#f44336', width: 100 }}>
                    <i className="fa fa-fw fa-ban"></i>&nbsp;Cancel
                </Button>
            </DialogActions>
        </>
    );
}
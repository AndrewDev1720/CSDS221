//Import react
import React, { Component } from "react";
//Import materials
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import DiaWrap from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
//Import components
import Dialog from './dialog';
// Import javascript
import moment from 'moment';
import toastr from 'toastr';
import { Checkbox } from "@mui/material";
// Export
export default class page extends Component {
    //Constructor
    constructor(props) {
        super(props);
        this.state = {
            task: {
                deadline: moment()
            },
            rows: [],
            open: false,
            type: "add",
            index: -1,
            data: {}
        };
    }

    //Add a new task
    addTask() {
        this.setState({type: "add"})
        this.setState({index: -1})
        this.setState({ open: true });
    };

    //Edit an existing task
    editTask(index) {
        this.setState({open: true});
        this.setState({type: "edit"});
        this.setState({index: index});
    }

    //Callback from dialog input
    dialogCallback = (data) => {//functional syntax intentional
        if (data.action === `submit`) {//submitted
            toastr.success(`Task added successfully!`, ``, { 'closeButton': true, positionClass: 'toast-bottom-right' });
            this.setState({ rows: [...this.state.rows, data.data] });
            this.setState({ open: false });
        } else if (data.action === `cancel`) {//cancelled
            this.setState({ open: false });
        } else if (data.action === 'edit') {
            this.editRow(data)
            toastr.success(`Task edited successfully!`, ``, { 'closeButton': true, positionClass: 'toast-bottom-right' });
            this.setState({ open: false });
        }
    }

    // Edit a row
    editRow = (data) => {
        let newRows = [...this.state.rows]
        newRows[data.index] = data.data
        
        this.setState({rows: newRows})
    }

    toggleIsComplete = (index) => {
        let newRow = [...this.state.rows]
        newRow[index]['checked'] = !newRow[index]['checked']
        this.setState({rows: newRow})
    }

    // Render
    render() {
        return (
            <>
                <DiaWrap
                    open={this.state.open}
                    onClose={() => this.dialogCallback()}>
                    <Dialog
                        type={this.state.type}
                        index={this.state.index}
                        data={this.state.data}
                        parentCallback={this.dialogCallback}
                        dataFromParent={this.state.task}
                        rowFromParent={this.state.rows} >
                    </Dialog>
                </DiaWrap>
                {/*master card*/}
                <Card sx={{ margin: '20px' }}>
                    {/*card header*/}
                    <CardHeader sx={{ bgcolor: 'primary.dark', color: 'white' }}
                        title={<><small><i className='fa fa-fw fa-bars'></i>FRAMEWORKS</small></>}
                        style={{ textAlign: 'center' }}
                        action={
                            <>
                                {/*button*/}
                                <Button variant="contained" onClick={() => this.addTask()} sx={{ width: 100, marginRight: '7px' }}>
                                    <i className="fa fa-fw fa-plus-circle"></i>Add
                                </Button>
                            </>
                        } />
                    {/*card content*/}
                    <CardContent sx={{ bgcolor: 'white', marginBottom: -1 }}>
                        <TableContainer>
                            <Table sx={{ bgcolor: 'white' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" sx={{ width: 0.1, color: 'gray' }}>Title</TableCell>
                                        <TableCell align="center" sx={{ width: 0.1, color: 'gray' }}>Description</TableCell>
                                        <TableCell align="center" sx={{ width: 0.1, color: 'gray' }}>Deadline</TableCell>
                                        <TableCell align="center" sx={{ width: 0.1, color: 'gray' }}>Priority</TableCell>
                                        <TableCell align="center" sx={{ width: 0.1, color: 'gray' }}>Is Complete</TableCell>
                                        <TableCell align="center" sx={{ width: 0.1, color: 'gray' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.rows.map((row, index) => (
                                        <TableRow key={row.title}>
                                            <TableCell align='center'>{row.title}</TableCell>
                                            <TableCell align="center">{row.description}</TableCell>
                                            <TableCell align="center">{new Date(row.deadline).toLocaleDateString("en-US")}</TableCell>
                                            <TableCell align="center">{row.priority}</TableCell>
                                            <TableCell align="center">{row.checked ? <Checkbox checked={row.checked} onChange={(e) => {this.toggleIsComplete(index)}}/>
                                            : <Checkbox checked={row.checked} onChange={(e) => {this.toggleIsComplete(index)}}/>}</TableCell>
                                            <TableCell align="center">
                                                {!row.checked && <Button variant="contained" sx={{ width: 100 }} onClick={() => this.editTask(index)}>
                                                    <i className="fa fa-fw fa-edit"></i>UPDATE
                                                </Button>}
                                                <Button variant="contained" 
                                                    onClick={() => {this.setState((prevState) => ({
                                                        rows: [...prevState.rows.slice(0, index), ...prevState.rows.slice(index + 1)]}));
                                                        toastr.success(`Task deleted successfully!`, ``, { 'closeButton': true, positionClass: 'toast-bottom-right' });
                                                    }}
                                                    color='error' 
                                                    sx={{ bgcolor: '#f44336', width: 100 }}
                                                >
                                                    <i className="fa fa-fw fa-times-circle"></i>DELETE
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </>
        );
    }
}
import React, { Component } from 'react';
import Note from './Note/Note';
import NoteForm from './NoteForm/NoteForm';
import { DB_CONFIG } from './config/config';
import firebase from 'firebase/app';
import 'firebase/database';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.addNote = this.addNote.bind(this);
    this.removeNote = this.removeNote.bind(this);

    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app.database().ref().child('notes');

    // We're going to setup the React state of our component
    this.state = {
      notes: [],
    }
  }

  componentWillMount(){

    // DataSnapshot
    this.database.on('child_added', snap => {

      const newNotes = this.state.notes.concat([{
        id: snap.key,
        noteContent: snap.val().noteContent,
      }])

      this.setState({
        notes: newNotes
      })
    })

    this.database.on('child_removed', snap => {

      const newNotes = this.state.notes.filter(note => note.id !== snap.key)

      this.setState({
        notes: newNotes
      })
    })
  }

  addNote(note){
    this.database.push().set({ noteContent: note});
  }

  removeNote(noteId){
    this.database.child(noteId).remove();
    
  }

  render() {
    return (
      <div className="notesWrapper">
        <div className="notesHeader">
          <div className="heading">React & Firebase To-Do List</div>
        </div>
        <div className="notesBody">
          {
            this.state.notes.map((note) => {
              return (
                <Note noteContent={note.noteContent} 
                noteId={note.id} 
                key={note.id} 
                removeNote ={this.removeNote}/>
              )
            })
          }
        </div>
        <div className="notesFooter">
          <NoteForm addNote={this.addNote} />
        </div>
      </div>
    );
  }
}

export default App;
import React, { Component } from 'react';
import Note from './Note/Note';
import NoteForm from './NoteForm/NoteForm';
import './App.css';
import { DB_CONFIG } from './config/config';
import firebase from 'firebase/app';
import './firebase/database';

class App extends Component {

  constructor(props){
    super(props);

    this.addNote = this.addNote.bind(this);

    this.app = firebase.initializeApp(DB_CONFIG);
    this.db = this.app.database().ref().child('notes');

    this.state = {
      notes: [],
    }
  }

  componentWillMount(){
    const previousNotes = this.state.note;

    this.database.on('child_added', snap => {
        previousNotes.push({
          id: snap.key,
          noteContent: snap.val().noteContent
        })

      this.setState({
        notes: previousNotes
      })
    })
  }

  addNote(note){
    /*const previousNotes = this.state.notes;
    previousNotes.push({ id: previousNotes.length + 1, noteContent: note });
    this.setState({
      notes: previousNotes
    })*/

    this.database.push().set({ noteContent: note});
  }

  render() {
    return (
      <div className="notesWrapper">
        <div className="notesHeader">
          <div className="heading">React and Firebase To-Do List</div>
        </div>
        <div className="notesBody">
        {
          this.state.notes.map((note) => {
            return (
                <Note noteContent={note.noteContent} noteId={note.id} key={note.id}/>
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
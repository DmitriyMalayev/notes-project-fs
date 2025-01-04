import React, { useEffect } from 'react'
import './App.css'
import { useState } from 'react'

interface Note {
  id: number
  title: string
  content: string
}

const App = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [notes, setNotes] = useState<Note[]>([])

  const newNote: Note = {
    id: notes.length + 1,
    title: title,
    content: content
  }

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:5000/notes')
        const notes: Note[] = await response.json()
        setNotes(notes)
      } catch (error) {
        console.error('Error fetching notes:', error)
      }
    }
    fetchNotes()
  }, [])

  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content
        })
      })

      const newNote = await response.json()

      setNotes([newNote, ...notes])
      setTitle('')
      setContent('')
    } catch (e) {
      console.log(e)
    }
  }

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNote) {
      return
    }
    const updateNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content
    }

    try {
      const response = await fetch(
        `http://localhost:5000/notes/${selectedNote.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateNote)
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update note')
      }

      const updatedNote = await response.json()

      const updatedNotesList = notes.map(note =>
        note.id === selectedNote.id ? updatedNote : note
      )

      setNotes(updatedNotesList)
      setTitle('')
      setContent('')
      setSelectedNote(null)
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setContent('')
    setSelectedNote(null)
  }

  const handleDeleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation()

    try {
      await fetch(`http://localhost:5000/notes/${noteId}`, {
        method: 'DELETE'
      })
      const updatedNotes = notes.filter(note => note.id !== noteId)

      setNotes(updatedNotes)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='app-container'>
      <form
        className='note-form'
        onSubmit={e => (selectedNote ? handleUpdateNote(e) : handleAddNote(e))}
      >
        <input
          placeholder='title'
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder='content'
          rows={10}
          required
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        {selectedNote ? (
          <div className='edit-buttons'>
            <button type='submit'>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type='submit'>Add Note</button>
        )}
      </form>
      <div className='notes-grid'>
        {notes.map(note => (
          <div
            className='note-item'
            key={note.id}
            onClick={() => handleNoteClick(note)}
          >
            <div className='notes-header'>
              <button onClick={e => handleDeleteNote(e, note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App

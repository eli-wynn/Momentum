import { useNoteStore, Note } from '../../stores/noteStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function NoteItem({ note, onSelect }: { note: Note, onSelect: (id: number) => void }) {
    const { deleteNote, copyNote } = useNoteStore()
    const formattedDate = new Date(note.lastEditedAt).toLocaleDateString()

    return (
        <div onClick={() => onSelect(note.id)} style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <h2 className="text-[15px] font-medium" style={{ color: 'var(--text-primary)' }}>
                        {note.title}
                    </h2>
                    <p style={{color: 'var(--text-tertiary)'}}>
                        {formattedDate} 
                    </p>
                </div>


                <div className="flex gap-2">
                    <button
                        onClick={(e) => {e.stopPropagation(), copyNote(note.id)}}
                        className="p-1.5 rounded-md transition hover:opacity-70 hover:scale-110"
                        style={{ backgroundColor: 'var(--green)', color: 'white'}}
                    >
                        <FontAwesomeIcon icon={faCopy} />  
                    </button>
                    <button
                        onClick={(e) => {deleteNote(note.id), e.stopPropagation()}}
                        className="p-1.5 rounded-md transition hover:opacity-70 hover:scale-110"
                        style={{ backgroundColor: 'var(--red)', color: 'white' }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        </div>
    )
}
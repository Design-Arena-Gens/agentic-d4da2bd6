"use client"

import { useEffect, useMemo, useState } from 'react'
import { Sparkles, Plus, CheckCircle2, NotebookPen, Crown, Trash2, Lock } from 'lucide-react'
import { getProActive, setProActive } from '@/lib/pro'
import { useLocalStorage } from '@/lib/useLocalStorage'
import Link from 'next/link'

type Note = { id: string; title: string; content: string; createdAt: number }
type Task = { id: string; title: string; done: boolean; createdAt: number }

const FREE_NOTES_LIMIT = 50
const FREE_TASKS_LIMIT = 100

export default function HomePage() {
  const [pro, setPro] = useState<boolean>(false)
  const [showPricing, setShowPricing] = useState(false)

  const [notes, setNotes] = useLocalStorage<Note[]>('notes', [])
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [])

  useEffect(() => {
    setPro(getProActive())
  }, [])

  const notesLeft = useMemo(() => Math.max(0, FREE_NOTES_LIMIT - notes.length), [notes])
  const tasksLeft = useMemo(() => Math.max(0, FREE_TASKS_LIMIT - tasks.length), [tasks])

  const addNote = () => {
    if (!pro && notes.length >= FREE_NOTES_LIMIT) {
      setShowPricing(true)
      return
    }
    const id = crypto.randomUUID()
    const newNote: Note = { id, title: 'Sem t?tulo', content: '', createdAt: Date.now() }
    setNotes([newNote, ...notes])
  }

  const updateNote = (id: string, patch: Partial<Note>) => {
    setNotes(notes.map(n => (n.id === id ? { ...n, ...patch } : n)))
  }

  const deleteNote = (id: string) => setNotes(notes.filter(n => n.id !== id))

  const addTask = (title: string) => {
    if (!pro && tasks.length >= FREE_TASKS_LIMIT) {
      setShowPricing(true)
      return
    }
    if (!title.trim()) return
    const id = crypto.randomUUID()
    const newTask: Task = { id, title: title.trim(), done: false, createdAt: Date.now() }
    setTasks([newTask, ...tasks])
  }

  const toggleTask = (id: string) => setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)))
  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id))

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/checkout', { cache: 'no-store' })
      if (res.redirected) {
        window.location.href = res.url
        return
      }
      const data = await res.json().catch(() => ({}))
      if (data?.demo === true) {
        setProActive(true)
        setPro(true)
        alert('Pro ativado em modo demonstra??o. Configure o checkout real depois.')
        setShowPricing(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <main className="container-app py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/10 grid place-items-center">
            <Sparkles className="text-accent" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Planner</h1>
            <p className="text-sm text-white/60">Seu dia simples e organizado</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {pro ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-semibold text-black">
              <Crown size={14} /> Pro ativo
            </span>
          ) : (
            <button className="btn-primary h-10 px-4" onClick={() => setShowPricing(true)}>
              <span className="inline-flex items-center gap-2"><Crown size={16}/> Assinar Pro R$ 19,90/m?s</span>
            </button>
          )}
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium inline-flex items-center gap-2"><NotebookPen size={18}/> Anota??es</h2>
            <button className="btn-ghost h-9 px-3" onClick={addNote}><Plus size={16}/> Nova</button>
          </div>
          {!pro && (
            <p className="text-xs text-white/60 mb-4">Limite gratuito: {FREE_NOTES_LIMIT}. Restam {notesLeft}.</p>
          )}

          {notes.length === 0 ? (
            <div className="text-white/60 text-sm">Sem anota??es ainda. Clique em "Nova".</div>
          ) : (
            <ul className="space-y-3">
              {notes.map(note => (
                <li key={note.id} className="rounded-xl border border-white/10 p-4 bg-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      className="input font-semibold"
                      value={note.title}
                      onChange={e => updateNote(note.id, { title: e.target.value })}
                      placeholder="T?tulo"
                    />
                    <button className="btn-ghost h-9 px-3" onClick={() => deleteNote(note.id)}>
                      <Trash2 size={16}/> Remover
                    </button>
                  </div>
                  <textarea
                    className="input min-h-[100px]"
                    value={note.content}
                    onChange={e => updateNote(note.id, { content: e.target.value })}
                    placeholder="Escreva sua nota aqui..."
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium inline-flex items-center gap-2"><CheckCircle2 size={18}/> Tarefas</h2>
            <QuickAddTask onAdd={addTask} />
          </div>
          {!pro && (
            <p className="text-xs text-white/60 mb-4">Limite gratuito: {FREE_TASKS_LIMIT}. Restam {tasksLeft}.</p>
          )}

          {tasks.length === 0 ? (
            <div className="text-white/60 text-sm">Sem tarefas. Adicione acima.</div>
          ) : (
            <ul className="space-y-2">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white/5 border border-white/10">
                  <button onClick={() => toggleTask(task.id)} className={`h-5 w-5 rounded-full border ${task.done ? 'bg-primary border-primary' : 'border-white/30'}`}/>
                  <div className={`flex-1 ${task.done ? 'line-through text-white/50' : ''}`}>{task.title}</div>
                  <button className="btn-ghost h-8 px-3" onClick={() => deleteTask(task.id)}><Trash2 size={16}/></button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {showPricing && (
        <PricingModal onClose={() => setShowPricing(false)} onCheckout={handleCheckout} />
      )}

      <footer className="mt-10 text-center text-xs text-white/50">
        <p>
          Dica: o modo Pro libera limites e futuros recursos como sincroniza??o.
          {process.env.NEXT_PUBLIC_CHECKOUT_URL ? null : (
            <span> (Checkout em demonstra??o)</span>
          )}
        </p>
        <p className="mt-2">? {new Date().getFullYear()} Planner</p>
      </footer>
    </main>
  )
}

function QuickAddTask({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <div className="flex items-center gap-2">
      <input
        className="input h-9"
        placeholder="Adicionar tarefa..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onAdd(value)
            setValue('')
          }
        }}
      />
      <button className="btn-ghost h-9 px-3" onClick={() => { onAdd(value); setValue('') }}>
        <Plus size={16}/> Adicionar
      </button>
    </div>
  )
}

function PricingModal({ onClose, onCheckout }: { onClose: () => void; onCheckout: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="card max-w-lg w-full p-6 relative">
        <button className="absolute right-4 top-4 text-white/60 hover:text-white" onClick={onClose}>?</button>
        <div className="flex items-center gap-2 mb-2">
          <Crown className="text-primary"/>
          <h3 className="text-xl font-semibold">Plano Pro</h3>
        </div>
        <p className="text-white/70 mb-6">Organiza??o completa por apenas <strong>R$ 19,90/m?s</strong>.</p>
        <ul className="space-y-2 text-sm text-white/90 mb-6">
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent"/> Notas e tarefas ilimitadas</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent"/> Temas e layout avan?ados</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent"/> Backup e sincroniza??o (em breve)</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent"/> Suporte priorit?rio</li>
        </ul>
        <button className="btn-primary w-full h-11" onClick={onCheckout}>
          Assinar agora por R$ 19,90/m?s
        </button>
        {!process.env.NEXT_PUBLIC_CHECKOUT_URL && (
          <p className="mt-3 text-center text-xs text-white/60">
            Sem checkout configurado: ativaremos o Pro em demonstra??o.
          </p>
        )}
      </div>
    </div>
  )
}

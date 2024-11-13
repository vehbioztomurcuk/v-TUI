'use client'

import React, { useState, useEffect, useRef } from 'react'
import useKeypress from 'react-use-keypress'
import { Mail, Twitter, Camera, Twitch, Music, Film, BookOpen, Github, Gitlab, Linkedin, Instagram, Copy, Check, ExternalLink } from 'lucide-react'

const useMenu = (items) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [history, setHistory] = useState([])

  const selectItem = () => {
    const selected = items[selectedIndex]
    if (selected.submenu) {
      setHistory([...history, { items, selectedIndex }])
      return selected.submenu
    }
    return null
  }

  const goBack = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1]
      setHistory(history.slice(0, -1))
      setSelectedIndex(previous.selectedIndex)
      return previous.items
    }
    return null
  }

  return { selectedIndex, setSelectedIndex, selectItem, goBack }
}

const socialLinks = [
  { label: 'Twitter', url: 'https://twitter.com/vehbioztomurcuk', icon: Twitter, description: 'Follow me on Twitter for updates and thoughts.' },
  { label: 'VSCO', url: 'https://vsco.co/vehbi-oztomurcuk/', icon: Camera, description: 'Check out my photography on VSCO.' },
  { label: 'Twitch', url: 'https://www.twitch.tv/Lbitter', icon: Twitch, description: 'Watch my live streams on Twitch.' },
  { label: 'Spotify', url: 'https://open.spotify.com/playlist/1oZIy4w6Rc4reO2PmftZgU', icon: Music, description: 'Listen to my curated playlist on Spotify.' },
  { label: 'IMDB', url: 'https://imdb.com/list/ls022272921/', icon: Film, description: 'Explore my favorite movies on IMDB.' },
  { label: 'Medium', url: 'https://medium.com/@vehbi.oztomurcuk', icon: BookOpen, description: 'Read my articles on Medium.' },
  { label: 'GitHub', url: 'https://github.com/vehbioztomurcuk', icon: Github, description: 'View my open-source projects on GitHub.' },
  { label: 'GitLab', url: 'https://gitlab.com/vehbi', icon: Gitlab, description: 'Check out my repositories on GitLab.' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/vehbi-%C3%B6ztomurcuk-198037172/', icon: Linkedin, description: 'Connect with me on LinkedIn.' },
  { label: 'Instagram', url: 'https://www.instagram.com/vehbitter/', icon: Instagram, description: 'Follow my visual journey on Instagram.' },
]

const TuiEmulator = () => {
  const [currentMenu, setCurrentMenu] = useState([
    { label: 'About Me', action: () => setCurrentView('about') },
    { label: 'Social Links', submenu: socialLinks.map(link => ({ ...link, action: () => setCurrentView('socialPreview') })) },
    { label: 'Contact', action: () => setCurrentView('contact') },
    { label: 'Exit', action: () => console.log('Exiting...') },
  ])

  const { selectedIndex, setSelectedIndex, selectItem, goBack } = useMenu(currentMenu)
  const [currentView, setCurrentView] = useState('main')
  const [copied, setCopied] = useState(false)
  const [selectedSocial, setSelectedSocial] = useState(null)

  useKeypress(['ArrowUp', 'ArrowDown', 'Enter', 'Escape'], (event) => {
    if (currentView === 'socialPreview' && event.key === 'Enter') {
      window.open(selectedSocial.url, '_blank')
      return
    }

    if (event.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : currentMenu.length - 1))
    } else if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => (prevIndex < currentMenu.length - 1 ? prevIndex + 1 : 0))
    } else if (event.key === 'Enter') {
      const newMenu = selectItem()
      if (newMenu) {
        setCurrentMenu(newMenu)
        setSelectedIndex(0)
      } else {
        const selectedItem = currentMenu[selectedIndex]
        if (selectedItem.url) {
          setSelectedSocial(selectedItem)
          setCurrentView('socialPreview')
        } else {
          selectedItem.action?.()
        }
      }
    } else if (event.key === 'Escape') {
      if (currentView !== 'main') {
        setCurrentView('main')
        setSelectedSocial(null)
      } else {
        const previousMenu = goBack()
        if (previousMenu) {
          setCurrentMenu(previousMenu)
        }
      }
    }
  })

  const copyEmail = () => {
    navigator.clipboard.writeText('hello@vehbi.co')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderContent = () => {
    switch (currentView) {
      case 'about':
        return (
          <div className="bg-black text-green-500 p-4 rounded border border-green-500">
            <h2 className="text-xl mb-2">About Me</h2>
            <p className="mb-2">Vehbi Öztomurcuk</p>
            <p className="mb-2">Alive human being for 10958 days</p>
            <p className="text-sm">
              Been crafting personal and corporate products since 2019. Recently started focusing on AI models and prompt engineering. I even edit videos and stream sometimes. Currently working on Oyuneks.
            </p>
          </div>
        )
      case 'contact':
        return (
          <div className="bg-black text-green-500 p-4 rounded border border-green-500">
            <h2 className="text-xl mb-2">Contact</h2>
            <div className="flex items-center">
              <Mail className="mr-2" size={16} />
              <span>hello@vehbi.co</span>
              <button onClick={copyEmail} className="ml-2 p-1 bg-green-500 text-black rounded">
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
            {copied && <span className="ml-2 text-green-600">Copied!</span>}
          </div>
        )
      case 'socialPreview':
        if (!selectedSocial) return null
        return (
          <div className="bg-black text-green-500 p-4 rounded border border-green-500">
            <h2 className="text-xl mb-2 flex items-center">
              <selectedSocial.icon className="mr-2" size={24} />
              {selectedSocial.label}
            </h2>
            <p className="mb-4">{selectedSocial.description}</p>
            <div className="flex items-center">
              <ExternalLink className="mr-2" size={16} />
              <span className="text-sm">{selectedSocial.url}</span>
            </div>
            <p className="mt-4 text-sm">Press Enter to open link or Escape to go back</p>
          </div>
        )
      default:
        return (
          <ul className="mb-4">
            {currentMenu.map((item, index) => (
              <li
                key={index}
                className={`py-1 px-2 ${index === selectedIndex ? 'bg-green-500 text-black' : ''}`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-500 p-4 font-mono">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl mb-4">Vehbi Öztomurcuk - TUI Portfolio</h1>
        {renderContent()}
        <div className="text-sm text-gray-500">
          <p>Use arrow keys to navigate, Enter to select, and Esc to go back.</p>
          <p>Current selection: {currentMenu[selectedIndex]?.label}</p>
        </div>
      </div>
    </div>
  )
}

export default TuiEmulator
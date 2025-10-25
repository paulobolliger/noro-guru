import Container from './Container'

export default function Footer() {
  return (
    <footer className="bg-noro text-white">
      <Container className="py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">© 2025 NORO – Intelligent Core by .guru</div>
        <div className="flex items-center gap-5 text-sm">
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:opacity-80">LinkedIn</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:opacity-80">GitHub</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:opacity-80">Instagram</a>
        </div>
      </Container>
    </footer>
  )
}


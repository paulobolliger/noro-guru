import { motion } from 'framer-motion'

export default function NeuralBackground() {
  const blobs = [
    { x: '-10%', y: '-20%', size: 320, color: 'from-guru/40 to-noro/40' },
    { x: '60%', y: '10%', size: 260, color: 'from-core/40 to-guru/30' },
    { x: '20%', y: '50%', size: 300, color: 'from-noro/30 to-guru/30' },
  ]
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute bg-gradient-to-br ${b.color} rounded-full blur-3xl opacity-50`}
          initial={{ x: '-10%', y: '-10%' }}
          animate={{
            x: [b.x, '0%', b.x],
            y: [b.y, '0%', b.y],
          }}
          transition={{ duration: 18 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: b.size, height: b.size }}
        />
      ))}
    </div>
  )
}


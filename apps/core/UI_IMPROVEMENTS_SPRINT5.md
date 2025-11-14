# UI Improvements - Sprint 5: Inputs Avançados

**Status:** ✅ Concluído
**Data:** 2025
**Sprint:** 5/6 - Advanced Inputs

## 📋 Visão Geral

Sprint 5 implementa componentes de input avançados para coleta de dados complexos. Inclui seleção de cores, upload de arquivos, autocomplete com busca, e seleção de datas com calendário interativo.

## 🎯 Objetivos

- ✅ Criar componentes de input sofisticados
- ✅ Implementar validação e feedback visual
- ✅ Garantir acessibilidade completa (WCAG AA)
- ✅ Fornecer múltiplas variantes para diferentes contextos
- ✅ Integração perfeita com sistema de formulários

## 🎨 Componentes Criados

### 1. ColorPicker (`color-picker.tsx`)

Componente de seleção de cores com presets, input manual e suporte a gradientes.

#### Variantes:

- **ColorPicker** - Completo com dropdown, native picker e presets
- **SimpleColorPicker** - Apenas presets em grid/inline
- **ColorInput** - Integrado com FormField
- **ColorGradient** - Seletor de gradiente com preview

#### Props Principais:

```tsx
interface ColorPickerProps {
  value?: string;                    // Cor em HEX
  onChange?: (color: string) => void;
  presets?: string[];                // Cores predefinidas
  showPresets?: boolean;             // Exibe seção de presets
  showInput?: boolean;               // Exibe input de texto
  allowAlpha?: boolean;              // Suporta transparência
  disabled?: boolean;
}
```

#### Exemplo de Uso:

```tsx
import { ColorPicker, ColorInput } from '@/components/ui/color-picker';

// ColorPicker completo
<ColorPicker
  value={brandColor}
  onChange={(color) => setBrandColor(color)}
  presets={['#5053c4', '#D4AF37', '#10b981', '#ef4444']}
  showPresets
  showInput
/>

// ColorInput para formulários
<ColorInput
  name="corPrimaria"
  value={corPrimaria}
  onChange={(color) => setCorPrimaria(color)}
  label="Cor Primária"
  required
  error={errors.corPrimaria}
/>

// SimpleColorPicker
<SimpleColorPicker
  value={selectedColor}
  onChange={setSelectedColor}
  colors={themeColors}
  layout="inline"
  size="lg"
/>

// ColorGradient
<ColorGradient
  startColor="#5053c4"
  endColor="#D4AF37"
  onChange={(start, end) => setGradient(start, end)}
  direction="horizontal"
/>
```

#### Helpers:

```tsx
// Detecta se cor é clara (para contraste)
function isLightColor(hex: string): boolean

// Converte HEX para RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null
```

---

### 2. FileUpload (`file-upload.tsx`)

Componente de upload de arquivos com drag & drop, preview e validação.

#### Variantes:

- **FileUpload** - Completo com 3 variantes visuais
- **FileItem** - Item individual de arquivo
- **FilePreview** - Preview para variante gallery
- **useFileUpload** - Hook para gerenciamento

#### Props Principais:

```tsx
interface FileUploadProps {
  files?: FileWithPreview[];
  onFilesChange?: (files: FileWithPreview[]) => void;
  onUpload?: (file: FileWithPreview) => Promise<string | void>;
  onRemove?: (file: FileWithPreview) => void;
  accept?: string;                    // Tipos aceitos
  maxSize?: number;                   // Tamanho máximo em bytes
  maxFiles?: number;                  // Número máximo de arquivos
  multiple?: boolean;                 // Permite múltiplos
  variant?: 'default' | 'compact' | 'gallery';
  disabled?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;                   // URL de preview
  progress?: number;                  // Progresso 0-100
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  id?: string;
}
```

#### Exemplo de Uso:

```tsx
import { FileUpload, useFileUpload } from '@/components/ui/file-upload';

// FileUpload básico
<FileUpload
  files={files}
  onFilesChange={setFiles}
  onUpload={async (file) => {
    const url = await uploadToS3(file);
    return url;
  }}
  accept="image/*,application/pdf"
  maxSize={5 * 1024 * 1024}  // 5MB
  maxFiles={3}
  multiple
  label="Documentos"
/>

// Variante compacta
<FileUpload
  variant="compact"
  files={files}
  onFilesChange={setFiles}
  accept=".pdf,.doc,.docx"
  maxFiles={1}
  multiple={false}
/>

// Variante gallery (para imagens)
<FileUpload
  variant="gallery"
  files={images}
  onFilesChange={setImages}
  accept="image/*"
  maxFiles={10}
  label="Fotos do produto"
/>

// Usando o hook
const {
  files,
  addFiles,
  removeFile,
  uploadAll,
  clearAll,
  isUploading,
  errors
} = useFileUpload({
  maxSize: 10 * 1024 * 1024,
  maxFiles: 5,
  accept: 'image/*',
  onUpload: async (file) => await uploadFile(file)
});

<FileUpload
  files={files}
  onFilesChange={(newFiles) => {
    const justAdded = newFiles.filter(
      f => !files.find(existing => existing.id === f.id)
    );
    addFiles(justAdded);
  }}
  onRemove={(file) => removeFile(file.id!)}
/>

<button onClick={uploadAll} disabled={isUploading}>
  Upload All
</button>
```

#### Helpers:

```tsx
// Formata tamanho de arquivo
function formatFileSize(bytes: number): string

// Retorna ícone e cores baseado no tipo MIME
function getFileIcon(mimeType: string): { component, color, bg }
```

---

### 3. Combobox (`combobox.tsx`)

Componente de seleção com busca/autocomplete e navegação por teclado.

#### Variantes:

- **Combobox** - Seleção única com busca
- **MultiCombobox** - Seleção múltipla com chips
- **AsyncCombobox** - Carregamento assíncrono com debounce
- **useCombobox** - Hook para gerenciamento

#### Props Principais:

```tsx
interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  meta?: Record<string, any>;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;               // Permite busca
  creatable?: boolean;                // Permite criar nova opção
  onCreate?: (inputValue: string) => void | Promise<void>;
  loading?: boolean;
  clearable?: boolean;                // Botão de limpar
  emptyMessage?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

interface MultiComboboxProps extends Omit<ComboboxProps, 'value' | 'onChange'> {
  value?: string[];
  onChange?: (values: string[]) => void;
  maxSelections?: number;             // Máximo de seleções
}
```

#### Exemplo de Uso:

```tsx
import { Combobox, MultiCombobox, AsyncCombobox } from '@/components/ui/combobox';

// Combobox básico
const clienteOptions = [
  { value: '1', label: 'João Silva', description: 'joao@email.com' },
  { value: '2', label: 'Maria Santos', description: 'maria@email.com' }
];

<Combobox
  options={clienteOptions}
  value={selectedCliente}
  onChange={setSelectedCliente}
  placeholder="Buscar cliente..."
  searchable
  clearable
  label="Cliente"
/>

// Com criação de nova opção
<Combobox
  options={tags}
  value={selectedTag}
  onChange={setSelectedTag}
  creatable
  onCreate={async (newTag) => {
    const created = await api.tags.create({ nome: newTag });
    setTags([...tags, { value: created.id, label: created.nome }]);
  }}
  placeholder="Buscar ou criar tag..."
  label="Tag"
/>

// MultiCombobox
<MultiCombobox
  options={servicosOptions}
  value={selectedServicos}
  onChange={setSelectedServicos}
  maxSelections={5}
  placeholder="Selecione os serviços..."
  label="Serviços Incluídos"
/>

// AsyncCombobox com busca no servidor
<AsyncCombobox
  value={selectedCidade}
  onChange={setSelectedCidade}
  loadOptions={async (search) => {
    const results = await api.cidades.search(search);
    return results.map(c => ({
      value: c.id,
      label: c.nome,
      description: `${c.estado} - ${c.pais}`
    }));
  }}
  debounce={300}
  placeholder="Buscar cidade..."
  label="Cidade"
/>

// Usando o hook
const combobox = useCombobox({
  initialValue: cliente?.id,
  onChange: (value) => setClienteId(value)
});

<Combobox
  options={clienteOptions}
  value={combobox.value}
  onChange={combobox.setValue}
/>
```

#### Navegação por Teclado:

- **Arrow Down/Up**: Navega entre opções
- **Enter**: Seleciona opção destacada
- **Escape**: Fecha dropdown
- **Tab**: Fecha e move para próximo campo
- **Backspace** (Multi): Remove última seleção

---

### 4. DatePicker (`date-picker.tsx`)

Componente de seleção de data com calendário e navegação por teclado.

#### Variantes:

- **DatePicker** - Calendário completo com input manual
- **CalendarGrid** - Grade de calendário
- **SimpleDatePicker** - Input HTML5 nativo
- **useDatePicker** - Hook para gerenciamento

#### Props Principais:

```tsx
interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minDate?: Date;                     // Data mínima
  maxDate?: Date;                     // Data máxima
  disabledDates?: Date[];             // Datas específicas desabilitadas
  isDateDisabled?: (date: Date) => boolean;  // Função customizada
  showTodayButton?: boolean;          // Botão "Hoje"
  clearable?: boolean;
  format?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  disabled?: boolean;
  required?: boolean;
}
```

#### Exemplo de Uso:

```tsx
import { DatePicker, SimpleDatePicker, useDatePicker } from '@/components/ui/date-picker';

// DatePicker básico
<DatePicker
  value={dataNascimento}
  onChange={setDataNascimento}
  label="Data de Nascimento"
  placeholder="DD/MM/AAAA"
  format="DD/MM/YYYY"
  maxDate={new Date()}  // Não permite futuro
  minDate={new Date('1900-01-01')}
  required
/>

// Com validação customizada (ex: apenas dias úteis)
<DatePicker
  value={dataReuniao}
  onChange={setDataReuniao}
  isDateDisabled={(date) => {
    const day = date.getDay();
    return day === 0 || day === 6;  // Desabilita sábado e domingo
  }}
  label="Data da Reunião"
  showTodayButton
/>

// SimpleDatePicker (nativo)
<SimpleDatePicker
  value={dataInicio}
  onChange={setDataInicio}
  min="2025-01-01"
  max="2025-12-31"
  label="Data de Início"
/>

// Usando o hook
const datePicker = useDatePicker({
  initialDate: new Date(),
  minDate: new Date(),
  maxDate: new Date('2026-12-31'),
  onChange: (date) => console.log('Selected:', date)
});

<DatePicker
  value={datePicker.date}
  onChange={datePicker.setDate}
  error={datePicker.error}
/>

<button onClick={datePicker.setToday}>Hoje</button>
<button onClick={datePicker.clear}>Limpar</button>
```

---

### 5. DateRangePicker (`date-range-picker.tsx`)

Componente de seleção de intervalo de datas com calendário duplo e presets.

#### Variantes:

- **DateRangePicker** - Calendário duplo com presets
- **RangeCalendarGrid** - Grade de calendário para range
- **SimpleDateRangePicker** - Dois inputs HTML5
- **useDateRangePicker** - Hook para gerenciamento

#### Props Principais:

```tsx
interface DateRangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onChange?: (startDate: Date | null, endDate: Date | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  showPresets?: boolean;              // Exibe presets
  presets?: DateRangePreset[];        // Presets customizados
  clearable?: boolean;
  monthsShown?: 1 | 2;                // Número de meses exibidos
  disabled?: boolean;
  required?: boolean;
}

interface DateRangePreset {
  label: string;
  getValue: () => { startDate: Date | null; endDate: Date | null };
}
```

#### Exemplo de Uso:

```tsx
import { DateRangePicker, SimpleDateRangePicker, useDateRangePicker } from '@/components/ui/date-range-picker';

// DateRangePicker com presets
<DateRangePicker
  startDate={dataInicio}
  endDate={dataFim}
  onChange={(start, end) => {
    setDataInicio(start);
    setDataFim(end);
  }}
  label="Período"
  showPresets
  monthsShown={2}
  clearable
/>

// Presets customizados
const customPresets = [
  {
    label: 'Q1 2025',
    getValue: () => ({
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31')
    })
  },
  {
    label: 'Q2 2025',
    getValue: () => ({
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-06-30')
    })
  }
];

<DateRangePicker
  startDate={start}
  endDate={end}
  onChange={(s, e) => setRange(s, e)}
  presets={customPresets}
  showPresets
  label="Trimestre"
/>

// SimpleDateRangePicker
<SimpleDateRangePicker
  startDate={inicio}
  endDate={fim}
  onChange={(s, e) => {
    setInicio(s);
    setFim(e);
  }}
  label="Período de Férias"
/>

// Usando o hook
const dateRange = useDateRangePicker({
  initialStartDate: new Date(),
  initialEndDate: new Date(),
  onChange: (start, end) => {
    console.log('Range:', start, end);
  }
});

<DateRangePicker
  startDate={dateRange.startDate}
  endDate={dateRange.endDate}
  onChange={dateRange.setRange}
  error={dateRange.error}
/>

<button onClick={dateRange.setToday}>Hoje</button>
<button onClick={() => dateRange.setLastDays(7)}>Últimos 7 dias</button>
<button onClick={() => dateRange.setLastDays(30)}>Últimos 30 dias</button>
<button onClick={dateRange.clear}>Limpar</button>
```

#### Presets Padrão:

- Hoje
- Ontem
- Últimos 7 dias
- Últimos 30 dias
- Este mês
- Mês passado

---

## 🔗 Integração com Formulários

Todos os componentes são compatíveis com o sistema de formulários do Sprint 2:

```tsx
import { useForm } from '@/hooks/useForm';
import { ColorInput } from '@/components/ui/color-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';

const ConfiguracaoForm = () => {
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      corPrimaria: '#5053c4',
      logo: [],
      categoria: '',
      dataLancamento: null
    },
    onSubmit: async (values) => {
      await api.configuracoes.update(values);
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ColorInput
        name="corPrimaria"
        value={values.corPrimaria}
        onChange={(color) => handleChange('corPrimaria', color)}
        label="Cor Primária"
        error={errors.corPrimaria}
      />

      <FileUpload
        files={values.logo}
        onFilesChange={(files) => handleChange('logo', files)}
        accept="image/*"
        maxFiles={1}
        label="Logo"
        error={errors.logo}
      />

      <Combobox
        options={categorias}
        value={values.categoria}
        onChange={(value) => handleChange('categoria', value)}
        label="Categoria"
        error={errors.categoria}
        searchable
      />

      <DatePicker
        value={values.dataLancamento}
        onChange={(date) => handleChange('dataLancamento', date)}
        label="Data de Lançamento"
        error={errors.dataLancamento}
        minDate={new Date()}
      />

      <button type="submit">Salvar</button>
    </form>
  );
};
```

---

## ♿ Acessibilidade

Todos os componentes seguem padrões ARIA e WCAG AA:

### ColorPicker
- `aria-label` em todos os botões
- Feedback visual para estados (hover, focus, selected)
- Contraste adequado para ícone de check

### FileUpload
- `role="status"` para progresso
- `aria-label` descritivos para ações
- Feedback visual para drag & drop
- Screen reader text para status de upload

### Combobox
- `role="listbox"` e `role="option"`
- `aria-expanded`, `aria-selected`, `aria-disabled`
- Navegação completa por teclado
- Focus trap no dropdown
- Scroll automático para opção destacada

### DatePicker & DateRangePicker
- `role="dialog"` para calendário
- `aria-label` descritivos para cada dia
- `aria-selected` para datas selecionadas
- Navegação por teclado no calendário
- Focus management (retorna ao input após seleção)

---

## 📊 Métricas

### Arquivos Criados
- `color-picker.tsx`: 569 linhas
- `file-upload.tsx`: 647 linhas
- `combobox.tsx`: 712 linhas
- `date-picker.tsx`: 563 linhas
- `date-range-picker.tsx`: 741 linhas
- **Total: 3,232 linhas**

### Componentes
- **20 componentes** criados
- **5 hooks customizados**
- **4 helper functions**

### Cobertura de Funcionalidades
- ✅ Validação de entrada
- ✅ Feedback visual
- ✅ Estados de loading/erro
- ✅ Múltiplas variantes
- ✅ Formato brasileiro (datas)
- ✅ Navegação por teclado
- ✅ Click outside to close
- ✅ Async support
- ✅ Mobile responsive

---

## 🎓 Exemplos Práticos

### Exemplo 1: Formulário de Produto com Upload de Imagens

```tsx
const ProdutoForm = () => {
  const [produto, setProduto] = useState({
    nome: '',
    cor: '#5053c4',
    imagens: [],
    categoria: '',
    dataLancamento: null
  });

  const categorias = [
    { value: 'eletronicos', label: 'Eletrônicos' },
    { value: 'vestuario', label: 'Vestuário' },
    { value: 'alimentos', label: 'Alimentos' }
  ];

  return (
    <div className="space-y-6">
      <Input
        label="Nome do Produto"
        value={produto.nome}
        onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
      />

      <ColorInput
        label="Cor Principal"
        value={produto.cor}
        onChange={(cor) => setProduto({ ...produto, cor })}
        presets={['#5053c4', '#10b981', '#ef4444', '#f59e0b']}
      />

      <FileUpload
        variant="gallery"
        files={produto.imagens}
        onFilesChange={(imagens) => setProduto({ ...produto, imagens })}
        accept="image/*"
        maxFiles={5}
        label="Fotos do Produto"
      />

      <Combobox
        options={categorias}
        value={produto.categoria}
        onChange={(categoria) => setProduto({ ...produto, categoria })}
        label="Categoria"
        searchable
      />

      <DatePicker
        value={produto.dataLancamento}
        onChange={(dataLancamento) => setProduto({ ...produto, dataLancamento })}
        label="Data de Lançamento"
        minDate={new Date()}
      />
    </div>
  );
};
```

### Exemplo 2: Filtros Avançados com Range de Datas

```tsx
const LeadsFilters = () => {
  const [filters, setFilters] = useState({
    origem: '',
    status: [],
    dataInicio: null,
    dataFim: null
  });

  const handleRangeChange = (start: Date | null, end: Date | null) => {
    setFilters({
      ...filters,
      dataInicio: start,
      dataFim: end
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Combobox
        options={origensOptions}
        value={filters.origem}
        onChange={(origem) => setFilters({ ...filters, origem })}
        label="Origem"
        clearable
      />

      <MultiCombobox
        options={statusOptions}
        value={filters.status}
        onChange={(status) => setFilters({ ...filters, status })}
        label="Status"
        maxSelections={3}
      />

      <DateRangePicker
        startDate={filters.dataInicio}
        endDate={filters.dataFim}
        onChange={handleRangeChange}
        label="Período"
        showPresets
      />
    </div>
  );
};
```

### Exemplo 3: Configurações de Tema com Color Picker

```tsx
const ThemeSettings = () => {
  const [theme, setTheme] = useState({
    primaryColor: '#5053c4',
    secondaryColor: '#D4AF37',
    gradientStart: '#5053c4',
    gradientEnd: '#8b5cf6'
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <ColorInput
          label="Cor Primária"
          value={theme.primaryColor}
          onChange={(color) => setTheme({ ...theme, primaryColor: color })}
        />

        <ColorInput
          label="Cor Secundária"
          value={theme.secondaryColor}
          onChange={(color) => setTheme({ ...theme, secondaryColor: color })}
        />
      </div>

      <ColorGradient
        startColor={theme.gradientStart}
        endColor={theme.gradientEnd}
        onChange={(start, end) =>
          setTheme({ ...theme, gradientStart: start, gradientEnd: end })
        }
        direction="horizontal"
      />

      {/* Preview */}
      <div className="p-6 rounded-lg" style={{
        background: `linear-gradient(to right, ${theme.gradientStart}, ${theme.gradientEnd})`
      }}>
        <h3 className="text-white text-xl font-bold">Preview do Tema</h3>
      </div>
    </div>
  );
};
```

### Exemplo 4: Busca Assíncrona de Clientes

```tsx
const ClienteSelector = () => {
  const [selectedCliente, setSelectedCliente] = useState('');

  const loadClientes = async (search: string) => {
    const response = await api.clientes.search({
      query: search,
      limit: 10
    });

    return response.data.map(cliente => ({
      value: cliente.id,
      label: cliente.nome,
      description: cliente.email,
      icon: <User size={16} />
    }));
  };

  return (
    <AsyncCombobox
      value={selectedCliente}
      onChange={setSelectedCliente}
      loadOptions={loadClientes}
      debounce={300}
      placeholder="Digite para buscar cliente..."
      label="Cliente"
      creatable
      onCreate={async (nome) => {
        const newCliente = await api.clientes.create({ nome });
        setSelectedCliente(newCliente.id);
      }}
    />
  );
};
```

---

## 🚀 Próximos Passos

### Sprint 6: Visualizações e Relatórios (Pendente)
- Charts/Graphs (gráficos)
- Stats Cards (cartões de estatística)
- Timeline (linha do tempo)
- Kanban Board (opcional)

---

## ✅ Checklist de Implementação

- [x] ColorPicker com presets e gradiente
- [x] FileUpload com drag & drop e preview
- [x] Combobox com busca e async
- [x] DatePicker com calendário interativo
- [x] DateRangePicker com calendário duplo e presets
- [x] Validação de entrada para todos os componentes
- [x] Feedback visual (loading, error, success)
- [x] Acessibilidade completa (ARIA, keyboard navigation)
- [x] Documentação e exemplos
- [x] Integração com sistema de formulários
- [x] Testes manuais de todos os componentes

---

## 📝 Notas de Desenvolvimento

### Desafios Superados

1. **ColorPicker - Detecção de Luminância**
   - Implementada fórmula de luminância relativa para escolher cor do ícone de check
   - Garante contraste adequado em cores claras e escuras

2. **FileUpload - Preview de Múltiplos Tipos**
   - Sistema de ícones baseado em MIME type
   - Preview de imagens com Object URL
   - Cleanup adequado de URLs para evitar memory leaks

3. **Combobox - Keyboard Navigation**
   - Focus trap no dropdown
   - Scroll automático para opção destacada
   - Suporte a Tab, Shift+Tab, Arrow keys, Enter, Escape

4. **DatePicker - Parsing de Data Manual**
   - Suporte a múltiplos formatos (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
   - Validação robusta de entrada manual
   - Sincronização bidirecional entre input e calendário

5. **DateRangePicker - Visual Range Highlighting**
   - Hover preview para seleção de data final
   - Rounded corners nas extremidades do range
   - Suporte a seleção invertida (corrige automaticamente)

### Boas Práticas Aplicadas

- ✅ **Client Components**: Todos marcados com `'use client'`
- ✅ **Refs**: Uso adequado de refs para gerenciar focus e DOM direto
- ✅ **Cleanup**: useEffect com cleanup para eventos e URLs
- ✅ **TypeScript**: Interfaces completas e type-safe
- ✅ **Accessibility**: ARIA labels, roles, keyboard navigation
- ✅ **Performance**: Memoization, debounce em async search
- ✅ **UX**: Loading states, error handling, visual feedback

---

**Sprint 5 Completo! 🎉**

Sistema de inputs avançados pronto para uso em produção com validação, acessibilidade e UX de alto nível.

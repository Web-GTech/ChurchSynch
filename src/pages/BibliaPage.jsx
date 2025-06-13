import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpenCheck, Search, Loader2, AlertTriangle, ChevronLeft, ChevronRight, Palette, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BIBLE_API_URL, bibleBooks, bibleTranslations } from '@/config/bibleConfig';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
// import VerseActions from '@/components/bible/VerseActions'; // VerseActions will be integrated here or removed
import VerseList from '@/components/bible/VerseList'; 

const highlightColors = [
  { name: 'Amarelo', value: 'bg-yellow-300/70 text-yellow-800 border-yellow-400', ring: 'ring-yellow-400' },
  { name: 'Verde', value: 'bg-green-300/70 text-green-800 border-green-400', ring: 'ring-green-400' },
  { name: 'Azul', value: 'bg-blue-300/70 text-blue-800 border-blue-400', ring: 'ring-blue-400' },
  { name: 'Rosa', value: 'bg-pink-300/70 text-pink-800 border-pink-400', ring: 'ring-pink-400' },
  { name: 'Roxo', value: 'bg-purple-300/70 text-purple-800 border-purple-400', ring: 'ring-purple-400' },
];


const BibleControls = ({ 
  selectedBook, setSelectedBook, 
  selectedChapter, setSelectedChapter, 
  chapters, isLoading, handleSearch,
  currentBookMaxChapters,
  goToPreviousChapter, goToNextChapter,
  highlightColor, setHighlightColor
}) => {
  return (
    <div className="space-y-3 p-2 sm:p-3 bg-background rounded-lg shadow border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
        <div className="space-y-1 md:col-span-1">
          <Label htmlFor="book-select" className="text-xs font-medium text-slate-600">Livro</Label>
          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger id="book-select" className="w-full bg-input h-9 text-xs border-slate-300 text-slate-700">
              <SelectValue placeholder="Selecione o Livro" />
            </SelectTrigger>
            <SelectContent>
              {bibleBooks.map(book => (
                <SelectItem key={book.abbrev} value={book.abbrev} className="text-xs">{book.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 md:col-span-1">
          <Label htmlFor="chapter-select" className="text-xs font-medium text-slate-600">Capítulo</Label>
          <div className="flex items-center gap-1">
            <Button onClick={goToPreviousChapter} variant="outline" size="icon" className="h-9 w-9 border-slate-300 text-slate-700 hover:bg-slate-100" disabled={isLoading || parseInt(selectedChapter) <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={selectedChapter} onValueChange={setSelectedChapter}>
              <SelectTrigger id="chapter-select" className="flex-grow bg-input h-9 text-xs border-slate-300 text-slate-700">
                <SelectValue placeholder="Cap." />
              </SelectTrigger>
              <SelectContent>
                {chapters.map(chapter => (
                  <SelectItem key={chapter} value={String(chapter)} className="text-xs">{chapter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={goToNextChapter} variant="outline" size="icon" className="h-9 w-9 border-slate-300 text-slate-700 hover:bg-slate-100" disabled={isLoading || parseInt(selectedChapter) >= currentBookMaxChapters}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-1 md:col-span-1">
          <Label htmlFor="highlight-color-select" className="text-xs font-medium text-slate-600">Cor da Marcação</Label>
          <Select value={highlightColor} onValueChange={setHighlightColor}>
            <SelectTrigger id="highlight-color-select" className="w-full bg-input h-9 text-xs border-slate-300 text-slate-700">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm ${highlightColors.find(c => c.value === highlightColor)?.value.split(' ')[0]}`}></div>
                  <span className="text-xs">{highlightColors.find(c => c.value === highlightColor)?.name}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {highlightColors.map(color => (
                <SelectItem key={color.value} value={color.value} className="text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${color.value.split(' ')[0]}`}></div>
                    {color.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleSearch} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-xs mt-2">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
        Carregar Capítulo
      </Button>
    </div>
  );
};

const VerseActionsComponent = ({ copySelectedVerses, countSelectedVerses }) => {
  if (countSelectedVerses === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="sticky bottom-0 left-0 right-0 p-2 bg-background/80 backdrop-blur-sm border-t border-slate-200 shadow-top-soft z-10"
    >
      <Button
        onClick={copySelectedVerses}
        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs h-9"
        disabled={countSelectedVerses === 0}
      >
        <Copy size={14} className="mr-1.5" />
        Copiar {countSelectedVerses} {countSelectedVerses === 1 ? 'Versículo' : 'Versículos'}
      </Button>
    </motion.div>
  );
};

const BibliaPage = () => {
  const [selectedBook, setSelectedBook] = useState(bibleBooks[0].abbrev);
  const [selectedChapter, setSelectedChapter] = useState('1');
  const [selectedTranslation] = useState(bibleTranslations[0].value); 
  const [chapters, setChapters] = useState(Array.from({ length: bibleBooks[0].chapters }, (_, i) => i + 1));
  const [currentBookMaxChapters, setCurrentBookMaxChapters] = useState(bibleBooks[0].chapters);
  const [bibleText, setBibleText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const [selectedVerses, setSelectedVerses] = useState({});
  const [currentHighlightColor, setCurrentHighlightColor] = useState(highlightColors[0].value);


  useEffect(() => {
    const book = bibleBooks.find(b => b.abbrev === selectedBook);
    if (book) {
      setChapters(Array.from({ length: book.chapters }, (_, i) => i + 1));
      setCurrentBookMaxChapters(book.chapters);
      if (parseInt(selectedChapter) > book.chapters) {
        setSelectedChapter('1');
      }
    }
    setSelectedVerses({}); 
  }, [selectedBook]);

  const fetchBibleText = useCallback(async (book, chapter, translation) => {
    if (!book || !chapter) return;

    setIsLoading(true);
    setError(null);
    setBibleText(null);
    setSelectedVerses({});

    try {
      const url = `${BIBLE_API_URL}/${book}+${chapter}?translation=${translation}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Falha ao buscar texto: ${response.statusText}`);
      }
      const data = await response.json();
      setBibleText(data);
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Erro ao carregar Bíblia",
        description: err.message || "Não foi possível buscar o texto bíblico. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBibleText(selectedBook, selectedChapter, selectedTranslation);
  }, [selectedBook, selectedChapter, selectedTranslation, fetchBibleText]);

  const handleSearch = () => {
    fetchBibleText(selectedBook, selectedChapter, selectedTranslation);
  };

  const goToPreviousChapter = () => {
    const currentChapterNum = parseInt(selectedChapter);
    if (currentChapterNum > 1) {
      setSelectedChapter(String(currentChapterNum - 1));
    }
  };

  const goToNextChapter = () => {
    const currentChapterNum = parseInt(selectedChapter);
    if (currentChapterNum < currentBookMaxChapters) {
      setSelectedChapter(String(currentChapterNum + 1));
    }
  };

  const toggleVerseSelection = (verseNumber) => {
    setSelectedVerses(prev => ({
      ...prev,
      [verseNumber]: !prev[verseNumber]
    }));
  };

  const copySelectedVerses = () => {
    const versesToCopy = bibleText?.verses
      .filter(v => selectedVerses[v.verse])
      .map(v => `${bibleText.reference}:${v.verse} - ${v.text}`)
      .join('\n');

    if (versesToCopy) {
      navigator.clipboard.writeText(versesToCopy)
        .then(() => {
          toast({ title: "Versículos Copiados!", description: "Os versículos selecionados foram copiados." });
        })
        .catch(() => {
          toast({ variant: "destructive", title: "Erro ao Copiar", description: "Não foi possível copiar os versículos." });
        });
    } else {
      toast({ variant: "destructive", title: "Nenhum Versículo Selecionado", description: "Selecione versículos para copiar." });
    }
  };
  
  const countSelectedVerses = Object.values(selectedVerses).filter(Boolean).length;

  return (
    <motion.div
      className="page-container full-height-page py-0 bg-slate-50" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col p-2 sm:p-3">
        <BibleControls 
          selectedBook={selectedBook} setSelectedBook={setSelectedBook}
          selectedChapter={selectedChapter} setSelectedChapter={setSelectedChapter}
          chapters={chapters} isLoading={isLoading} handleSearch={handleSearch}
          currentBookMaxChapters={currentBookMaxChapters}
          goToPreviousChapter={goToPreviousChapter}
          goToNextChapter={goToNextChapter}
          highlightColor={currentHighlightColor}
          setHighlightColor={setCurrentHighlightColor}
        />
        
        <div className="flex-grow min-h-[300px] sm:min-h-[400px] flex flex-col overflow-hidden mt-2 relative">
          {isLoading && (
            <div className="flex-grow flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          {error && !isLoading && (
            <div className="flex-grow flex flex-col justify-center items-center text-center py-8 text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertTriangle className="h-8 w-8 mb-1" />
              <p className="font-semibold text-sm">Erro ao carregar o texto:</p>
              <p className="text-xs">{error}</p>
            </div>
          )}
          {bibleText && !isLoading && !error && (
            <VerseList 
              bibleText={bibleText} 
              selectedVerses={selectedVerses} 
              toggleVerseSelection={toggleVerseSelection} 
              highlightColor={currentHighlightColor}
            />
          )}
          {!bibleText && !isLoading && !error && (
            <div className="flex-grow flex flex-col justify-center items-center text-center py-8 text-slate-500">
                <BookOpenCheck size={32} className="mb-2" />
                <p className="text-sm">Selecione um livro e capítulo para ler.</p>
            </div>
          )}
          <VerseActionsComponent 
            copySelectedVerses={copySelectedVerses}
            countSelectedVerses={countSelectedVerses}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BibliaPage;
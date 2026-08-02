'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import type { MediaSearchResult, MediaData } from '@/lib/grid';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SectionShell } from '@/components/shared/section-shell';
import { Input } from '@/components/ui/input';
import { useDebounce } from "@uidotdev/usehooks";
import { Spinner } from '@/components/ui/spinner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaData) => void;
  slotIndex: number;
}

const typeOptions = [
  {
    value: "movie",
    label: "Movie",
    description: "Search movies from TMDB",
  },
  {
    value: "tv",
    label: "TV Show",
    description: "Search TV shows from TMDB",
  },
]

export function SearchDialog({ isOpen, onClose, onSelect, slotIndex }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<MediaSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<typeof typeOptions[number]['value']>('tv');

  useEffect(() => {
    const handleSearchDebounced = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        setResults([]);
        setError('');
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get('/api/tools/grid/search', {
          params: { q: debouncedQuery, type: selectedType },
        });
        setResults(response.data.results || []);
      } catch (err) {
        setError('Failed to search media');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    handleSearchDebounced();
  }, [debouncedQuery, selectedType]);

  const handleSelect = (result: MediaSearchResult) => {
    const show: MediaData = {
      id: result.id,
      title: result.name,
      posterUrl: result.posterPath,
      label: '',
      type: selectedType,
    };
    onSelect(show);
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-[90svh] h-[90svh] flex flex-col p-0 overflow-hidden">
        <SectionShell
          id={`search-dialog-${slotIndex}`}
          eyebrow="Search"
          title="Search media"
          description="Search for your media and add them to your grid."
          className="min-h-0 flex-1 flex flex-col"
          compact
        >
          <div className="flex flex-col flex-1 min-h-0 gap-6">
    <Combobox
      items={typeOptions}
      value={typeOptions.find((item) => item.value === selectedType)}
      onValueChange={(item) => {
        if (item) {
          setSelectedType(item.value);
        }
      }}
      itemToStringValue={(item) => item.label}
    >
      <ComboboxInput placeholder="Select media type..." />

      <ComboboxContent>
        <ComboboxEmpty>No media types found.</ComboboxEmpty>

        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle>{item.label}</ItemTitle>
                  <ItemDescription>
                    {item.description}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
            <Input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.currentTarget.value);
              }}
              placeholder="Search..."
              className="w-full"
              autoFocus
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner className="w-6 h-6" />
              </div>
            ) : results.length === 0 && query ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No media found</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">Start typing to search</p>
              </div>
            ) : (
              <div className="flex-1 flex min-h-0 relative">
                <ScrollArea className="flex-1">
                  <div className="grid grid-cols-2 gap-6">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        className="group relative aspect-2/3 overflow-hidden rounded-lg transition-all"
                      >
                        <Image
                          unoptimized
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          fill
                          priority={false}
                          src={result.posterPath || "/images/placeholder.webp"}
                          alt={result.name}
                          className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder.webp";
                          }}
                        />
                        {/* Text overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex items-end">
                          <div className="p-2 w-full">
                            <p className="text-white text-sm font-semibold line-clamp-2">
                              {result.name}
                            </p>
                            {result.year && (
                              <p className="text-slate-300 text-xs mt-1">
                                {result.year}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
            )}
          </div>
        </SectionShell>
      </DialogContent>
    </Dialog>
  );
}

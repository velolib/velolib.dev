"use client"

import GradientBackground from '@/components/layout/gradient-background';
import { MediaCard } from '@/components/tools/grid/media-card';
import { SearchDialog } from '@/components/tools/grid/search-dialog';
import { SectionShell } from '@/components/shared/section-shell';
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldTitle } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { GridData, MediaData } from '@/lib/grid';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Share2 } from 'lucide-react';

const INITIAL_GRID: (MediaData | null)[] = Array(9).fill(null);

export function GridMaker() {
  const [medias, setMedias] = useState<(MediaData | null)[]>(INITIAL_GRID);
  const [showTitles, setShowTitles] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [isSquare, setIsSquare] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSelectMedia = useCallback((slot: number, show: MediaData) => {
    setMedias((prev) => {
      const updated = [...prev];
      updated[slot] = show;
      return updated;
    });
    setSelectedSlot(null);
  }, []);

  const handleRemoveMedia = useCallback((slot: number) => {
    setMedias((prev) => {
      const updated = [...prev];
      updated[slot] = null;
      return updated;
    });
  }, []);

  const handleUpdateLabel = useCallback((slot: number, label: string) => {
    setMedias((prev) => {
      const updated = [...prev];
      if (updated[slot]) {
        updated[slot] = { ...updated[slot]!, label };
      }
      return updated;
    });
  }, []);

  const handleShare = async () => {
    if (!medias.some((media) => media !== null)) {
      setError('Add at least one media to share');
      return;
    }

    setSharing(true);
    setError('');

    try {
      const gridData: GridData = {
        medias: medias,
        showTitles,
        showLabels,
        isSquare,
        createdAt: Date.now(),
      };

      const response = await axios.post('/api/tools/grid/share', gridData);
      const { shareId } = response.data;
      // console.log('Share created with ID:', shareId);

      router.push(`/tools/grid/${shareId}`);

    } catch (err) {
      setError('Failed to create share');
      console.error(err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <main className="relative h-[calc(100dvh-var(--nav-height))] snap-y snap-proximity overflow-x-hidden overflow-y-auto scroll-smooth">
      <SectionShell
        id="media-grid"
        eyebrow="Tools"
        title="Media grid"
        description="Create a 3×3 grid of your favorite media and share it with others."
      >
        <GradientBackground />
        <Card className="p-6 flex flex-wrap gap-6">
          <FieldGroup>
            <FieldSet>
              <FieldGroup className="flex flex-col md:flex-row gap-6">
                <FieldLabel htmlFor="showTitles">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Show Titles</FieldTitle>
                      <FieldDescription>Toggle to show or hide titles of the media in the grid.</FieldDescription>
                    </FieldContent>
                    <Switch
                      id="showTitles"
                      checked={showTitles}
                      onCheckedChange={(checked) => setShowTitles(checked)}
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="showLabels">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Show Labels</FieldTitle>
                      <FieldDescription>Toggle to show or hide labels of the media in the grid.</FieldDescription>
                    </FieldContent>
                    <Switch
                      id="showLabels"
                      checked={showLabels}
                      onCheckedChange={(checked) => setShowLabels(checked)}
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="isSquare">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Square Grid</FieldTitle>
                      <FieldDescription>Toggle to make the grid square or use a 2:3 ratio.</FieldDescription>
                    </FieldContent>
                    <Switch
                      id="isSquare"
                      checked={isSquare}
                      onCheckedChange={(checked) => setIsSquare(checked)}
                    />
                  </Field>
                </FieldLabel>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
          {error && (
            <Card className="bg-destructive border-destructive text-white/90 rounded-lg p-4 text-sm w-full">
              {error}
            </Card>
          )}
          <Button
            onClick={handleShare}
            disabled={!medias.some((s) => s !== null) || sharing}
            className="w-full"
          >
            <Share2 className="size-4.5" />
            {sharing ? 'Creating share...' : 'Share Grid'}
          </Button>
        </Card>
        {/* Grid */}
        <ScrollArea className="w-full">
          <div className="grid grid-cols-3 gap-4 min-w-200 sm:min-w-300 lg:min-w-full">
            {medias.map((media, idx) => (
              <div key={idx} onClick={() => !media && setSelectedSlot(idx)}>
                <MediaCard
                  media={media}
                  showTitle={showTitles}
                  showLabel={showLabels}
                  editable={true}
                  onClick={() => setSelectedSlot(idx)}
                  onRemove={() => handleRemoveMedia(idx)}
                  onEditLabel={(label) => handleUpdateLabel(idx, label)}
                  isSquare={isSquare}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Search Dialog */}
        <SearchDialog
          isOpen={selectedSlot !== null}
          onClose={() => setSelectedSlot(null)}
          onSelect={(media) => handleSelectMedia(selectedSlot!, media)}
          slotIndex={selectedSlot || 0}
        />
      </SectionShell>
    </main>
  );
}

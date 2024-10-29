'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { useEnv } from '@/context/EnvContext';
import { useReaderStore, DEFAULT_BOOK_STATE } from '@/store/readerStore';

import Spinner from '@/components/Spinner';
import FoliateViewer from './FoliateViewer';
import SideBar from './SideBar';
import PageInfo from './PageInfo';
import HeaderBar from './HeaderBar';
import FooterBar from './FooterBar';
import SectionInfo from './SectionInfo';
import useShortcuts from '@/hooks/useShortcuts';

const ReaderContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ids = (searchParams.get('ids') || '').split(',');

  const { envConfig } = useEnv();
  const { books, settings, initBookState, saveConfig, saveSettings } = useReaderStore();
  const { getFoliateView } = useReaderStore();

  const [sideBarWidth, setSideBarWidth] = useState(
    settings.globalReadSettings.sideBarWidth ?? '25%',
  );
  const [isSideBarPinned, setIsSideBarPinned] = useState(
    settings.globalReadSettings.isSideBarPinned ?? true,
  );
  const [isSideBarVisible, setSideBarVisibility] = useState(isSideBarPinned);

  const getKey = (id: string, index: number) => `${id}-${index}`;
  const bookStates = ids.map((id, index) => books[getKey(id, index)] || DEFAULT_BOOK_STATE);
  const [sideBarBookKey, setSideBarBookKey] = useState(getKey(ids[0] ?? '', 0));
  const [hoveredBookKey, setHoveredBookKey] = useState('');

  useEffect(() => {
    if (ids.length === 0) return;
    const uniqueIds = new Set<string>();
    ids.forEach((id, index) => {
      const isPrimary = !uniqueIds.has(id);
      uniqueIds.add(id);
      const key = getKey(id, index);
      if (books[key]) return;
      console.log('fetching book', key);
      initBookState(envConfig, id, key, isPrimary);
    });
  }, [ids, settings]);

  const switchSidebar = () => {
    setSideBarBookKey((prevKey: string) => {
      const bookKeys = ids.map((id, index) => getKey(id, index));
      const index = bookKeys.findIndex((key) => prevKey === key);
      const nextIndex = (index + 1) % bookKeys.length;
      return bookKeys[nextIndex]!;
    });
  };

  const toggleSidebar = () => {
    setSideBarVisibility((prev) => !prev);
  };

  const openSplitView = () => {
    console.log('open split view');
    const params = new URLSearchParams(searchParams.toString());
    const sideBarBookId = sideBarBookKey.split('-')[0];
    const updatedIds = [...ids, sideBarBookId].join(',');
    params.set('ids', updatedIds);
    router.push(`?${params.toString()}`);
  };

  const goLeft = () => {
    getFoliateView(sideBarBookKey)?.goLeft();
  };

  const goRight = () => {
    getFoliateView(sideBarBookKey)?.goRight();
  };

  const reloadPage = () => {
    window.location.reload();
  };

  useShortcuts(
    {
      onOpenSplitView: openSplitView,
      onSwitchSidebar: switchSidebar,
      onToggleSidebar: toggleSidebar,
      onReloadPage: reloadPage,
      onGoLeft: goLeft,
      onGoRight: goRight,
    },
    [sideBarBookKey, searchParams],
  );

  const handleSideBarResize = (newWidth: string) => {
    setSideBarWidth(newWidth);
    settings.globalReadSettings.sideBarWidth = newWidth;
  };

  const handleSideBarTogglePin = () => {
    if (isSideBarPinned && isSideBarVisible) {
      setSideBarVisibility(false);
    }
    setIsSideBarPinned(!isSideBarPinned);
    settings.globalReadSettings.isSideBarPinned = !isSideBarPinned;
  };

  const closeBook = (bookKey: string) => {
    const bookState = books[bookKey];
    if (!bookState) return;
    const { book, config, isPrimary } = bookState;
    if (isPrimary && book && config) {
      saveConfig(envConfig, book, config);
    }
  };

  const handleCloseBooks = () => {
    ids.forEach((id, index) => {
      const key = getKey(id, index);
      closeBook(key);
    });
    saveSettings(envConfig, settings);
    router.replace('/library');
  };

  const handleCloseBook = (bookKey: string) => {
    closeBook(bookKey);
    setSideBarBookKey((prevKey: string) => {
      if (prevKey === bookKey) {
        const index = ids.findIndex((id) => prevKey.startsWith(id));
        const nextIndex = (index + 1) % ids.length;
        return getKey(ids[nextIndex]!, nextIndex);
      }
      return prevKey;
    });
    const newIds = ids.filter((id, index) => getKey(id, index) !== bookKey);
    if (newIds.length > 0) {
      router.replace(`/reader?ids=${newIds.join(',')}`);
    } else {
      saveSettings(envConfig, settings);
      router.back();
    }
  };

  const getGridTemplate = () => {
    const count = ids.length;
    const aspectRatio = window.innerWidth / window.innerHeight;

    if (count <= 1) {
      // One book, full screen
      return { columns: '1fr', rows: '1fr' };
    } else if (count === 2) {
      if (aspectRatio < 1) {
        // portrait mode: horizontal split
        return { columns: '1fr', rows: '1fr 1fr' };
      } else {
        // landscape mode: vertical split
        return { columns: '1fr 1fr', rows: '1fr' };
      }
    } else if (count === 3 || count === 4) {
      // Three or four books, 2x2 grid
      return { columns: '1fr 1fr', rows: '1fr 1fr' };
    } else {
      // Five or more books, a 3x3 grid
      return { columns: '1fr 1fr 1fr', rows: '1fr 1fr 1fr' };
    }
  };

  const bookState = bookStates[0];
  if (bookStates.length !== ids.length || !bookState || !bookState.book || !bookState.bookDoc) {
    return (
      <div className={'flex-1'}>
        <Spinner loading={true} />
        {bookState?.error && (
          <div className='text-center'>
            <h2 className='text-red-500'>{bookState.error}</h2>
          </div>
        )}
      </div>
    );
  }

  const gridWidth = isSideBarPinned && isSideBarVisible ? `calc(100% - ${sideBarWidth})` : '100%';

  return (
    <div className='flex h-screen'>
      <SideBar
        bookKey={sideBarBookKey}
        width={sideBarWidth}
        isVisible={isSideBarVisible}
        isPinned={isSideBarPinned}
        onResize={handleSideBarResize}
        onTogglePin={handleSideBarTogglePin}
        onGoToLibrary={handleCloseBooks}
        onOpenSplitView={openSplitView}
        onSetVisibility={(visibility: boolean) => setSideBarVisibility(visibility)}
      />

      <div
        className='grid h-full'
        style={{
          width: gridWidth,
          gridTemplateColumns: getGridTemplate().columns,
          gridTemplateRows: getGridTemplate().rows,
        }}
      >
        {bookStates.map((bookState, index) => {
          const key = getKey(ids[index]!, index);
          const { book, config, bookDoc } = bookState;
          if (!book || !config || !bookDoc) return null;
          const { section, pageinfo, progress, chapter } = config;
          return (
            <div key={key} className='relative h-full w-full overflow-hidden'>
              <HeaderBar
                bookKey={key}
                bookTitle={book?.title}
                isHoveredAnim={ids.length > 2}
                hoveredBookKey={hoveredBookKey}
                isSideBarVisible={isSideBarVisible}
                sideBarBookKey={sideBarBookKey}
                setSideBarVisibility={setSideBarVisibility}
                setSideBarBookKey={setSideBarBookKey}
                setHoveredBookKey={setHoveredBookKey}
                onCloseBook={handleCloseBook}
              />
              <FoliateViewer bookKey={key} bookDoc={bookDoc!} bookConfig={config!} />
              <SectionInfo chapter={chapter} />
              <PageInfo bookFormat={book.format} section={section} pageinfo={pageinfo} />
              <FooterBar
                bookKey={key}
                progress={progress}
                isHoveredAnim={false}
                hoveredBookKey={hoveredBookKey}
                setHoveredBookKey={setHoveredBookKey}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReaderContent;

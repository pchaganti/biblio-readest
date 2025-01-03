import React from 'react';
import Popup from '@/components/Popup';
import PopupButton from './PopupButton';
import HighlightOptions from './HighlightOptions';
import { Position } from '@/utils/sel';
import { HighlightColor, HighlightStyle } from '@/types/book';

interface AnnotationPopupProps {
  buttons: Array<{ tooltipText: string; Icon: React.ElementType; onClick: () => void }>;
  position: Position;
  trianglePosition: Position;
  highlightOptionsVisible: boolean;
  selectedStyle: HighlightStyle;
  selectedColor: HighlightColor;
  popupWidth: number;
  popupHeight: number;
  onHighlight: (update?: boolean) => void;
}

const highlightOptionsHeightPx = 28;
const highlightOptionsPaddingPx = 16;

const AnnotationPopup: React.FC<AnnotationPopupProps> = ({
  buttons,
  position,
  trianglePosition,
  highlightOptionsVisible,
  selectedStyle,
  selectedColor,
  popupWidth,
  popupHeight,
  onHighlight,
}) => {
  return (
    <div>
      <Popup
        width={popupWidth}
        height={popupHeight}
        position={position}
        trianglePosition={trianglePosition}
        className='selection-popup bg-gray-600 px-4 text-white'
        triangleClassName='text-gray-600'
      >
        <div className='selection-buttons flex h-11 items-center justify-between'>
          {buttons.map((button, index) => (
            <PopupButton
              key={index}
              showTooltip={!highlightOptionsVisible}
              tooltipText={button.tooltipText}
              Icon={button.Icon}
              onClick={button.onClick}
            />
          ))}
        </div>
      </Popup>
      {highlightOptionsVisible && (
        <HighlightOptions
          style={{
            width: `${popupWidth}px`,
            height: `${popupHeight}px`,
            left: `${position.point.x}px`,
            top: `${
              position.point.y +
              (highlightOptionsHeightPx + highlightOptionsPaddingPx) *
                (trianglePosition.dir === 'up' ? -1 : 1)
            }px`,
          }}
          selectedStyle={selectedStyle}
          selectedColor={selectedColor}
          onHandleHighlight={onHighlight}
        />
      )}
    </div>
  );
};

export default AnnotationPopup;

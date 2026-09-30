import React, { ReactNode } from 'react';

import { LanguageNameData } from '@data/LanguageNames';
import useLanguageName from '@data/useLanguageName';

import { Button } from '@shared/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@shared/shadcn/ui/dropdown-menu';

type Props = {
  label?: ReactNode;
  current: string;
  onChange: (newLanguage: string) => void;
  options: string[];
  disabled?: boolean;
  includeLocalizedName?: boolean;
};

const LanguageDropdown: React.FC<Props> = ({
  label,
  current,
  onChange,
  options,
  disabled = false,
  includeLocalizedName = true,
}) => {
  const { getLanguageName } = useLanguageName();
  const languageOptions = options
    .map(getLanguageName)
    .sort((a, b) => a.endonym.localeCompare(b.endonym));

  return (
    <div className="flex items-center gap-2 justify-between">
      {label && <strong>{label}</strong>}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" role="dropdown" disabled={disabled}>
              <div className="truncate text-ellipsis">
                <Label
                  lang={getLanguageName(current)}
                  includeLocalizedName={includeLocalizedName}
                />
              </div>
            </Button>
          }
        />
        <DropdownMenuContent className="w-fit">
          <DropdownMenuRadioGroup value={current} onValueChange={onChange}>
            {languageOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option.endonym}
                value={option.code}
                className="cursor-pointer"
              >
                <Label lang={option} includeLocalizedName={includeLocalizedName} />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

type LabelProps = {
  lang: LanguageNameData;
  includeLocalizedName: boolean;
};

function Label({ lang, includeLocalizedName }: LabelProps) {
  return (
    <>
      {lang.endonym}{' '}
      {includeLocalizedName && (
        <em className="text-muted-foreground font-light">
          {lang.localized?.toLowerCase() != lang.endonym.toLowerCase() && lang.localized}
        </em>
      )}
    </>
  );
}

export default LanguageDropdown;

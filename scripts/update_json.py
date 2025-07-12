import os
import json
import yaml
import aiohttp
import asyncio
from aiofiles import open as aio_open

ISO_PATH = "src/data/iso639-1.json"
LANGS_DIR = "src/data/langs"
TSX_PATH = "src/data/translatedLanguages.tsx"
RAW_URL = "https://raw.githubusercontent.com/TheTeamVivek/YukkiMusic/master/strings/langs"

async def fetch_and_save(session, key, translated_languages):
    url = f"{RAW_URL}/{key}.yml"
    async with session.get(url) as res:
        if res.status == 200:
            try:
                text = await res.text()
                yml_content = yaml.safe_load(text)
                async with aio_open(f"{LANGS_DIR}/{key}.json", "w", encoding="utf-8") as jf:
                    await jf.write(json.dumps(yml_content, indent=4, ensure_ascii=False))
                translated_languages.append(key)
                print(f"✅ Saved {key}.json")
            except Exception as e:
                print(f"❌ Error in {key}.yml: {e}")
        else:
            print(f"⚠️ {key}.yml not found, skipping.")

async def generate_tsx(translated_languages):
    tsx_content = f"""// Auto-generated file - DO NOT EDIT MANUALLY
// This file is generated during the build process

export const TRANSLATED_LANGUAGES: string[] = {json.dumps(sorted(translated_languages), indent=2)};

export const getTranslatedLanguages = (): string[] => {{
  return TRANSLATED_LANGUAGES;
}};

export const isLanguageTranslated = (code: string): boolean => {{
  return TRANSLATED_LANGUAGES.includes(code.toLowerCase());
}};
"""
    async with aio_open(TSX_PATH, "w", encoding="utf-8") as tsx_file:
        await tsx_file.write(tsx_content)

async def main():
    os.makedirs(LANGS_DIR, exist_ok=True)

    with open(ISO_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    translated_languages = []

    async with aiohttp.ClientSession() as session:
        tasks = [
            fetch_and_save(session, key, translated_languages)
            for key in data
        ]
        await asyncio.gather(*tasks)

    await generate_tsx(translated_languages)
    print(f"\n📄 Generated translatedLanguages.tsx with {len(translated_languages)} languages")

if __name__ == "__main__":
    asyncio.run(main())
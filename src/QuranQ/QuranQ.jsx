import { useCallback, useEffect, useRef, useState } from 'react';
import { API_URL } from '../utils/constants';
import { getArabicNumber } from '../utils/strings';

export default function QuranQ() {
  const [search, setSearch] = useState([]);
  const [selectedId, setSelectedId] = useState(1);
  const [current, setCurrent] = useState({});
  const [surat, setSurat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const getSuratById = useCallback(async () => {
    setIsLoading(true);
    try {
      const _data = await fetch(
        `${API_URL}/surat/${selectedId}`
      ).then((res) => res.json());
      setCurrent(_data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [selectedId]);
  const getAllSurat = async () => {
    const _data = await fetch(`${API_URL}/surat`).then((res) =>
      res.json()
    );
    setSurat(_data);
  };

  useEffect(() => {
    if (surat.length === 0) {
      getAllSurat();
    }
    getSuratById();
  }, [selectedId]);
  useEffect(() => {
    document.onclick = function (e) {
      if (search.length > 0 && !e.target.closest('.autocomplete')) {
        setSearch([]);
      }
    };
  }, [search]);

  const handleSearch = (e) => {
    const { value } = e.target;
    const result = surat
      .filter((s) => s.nama_latin.toLowerCase().includes(value.toLowerCase()))
      .map((s) => ({
        value: s.nomor,
        label: s.nama_latin,
      }));
    setSearch(result);
  };

  const handleSelect = (id) => () => {
    setSelectedId(id);
    setSearch([]);
    searchRef.current.value = '';
  };

  return (
    <div className="container p-3 shadow-xl border rounded mx-auto max-w-md mt-3 bg-gray-100">
      <div className="autocomplete relative">
        <div className="border flex rounded items-center bg-white">
          <i className="fas fa-search fa-fw mx-3 text-gray-500"></i>
          <input
            type="text"
            className="p-2 pl-0 w-full focus:outline-none"
            placeholder="Cari surat..."
            onChange={handleSearch}
            ref={searchRef}
          />
        </div>
        <div className="bg-white absolute w-full bg-yellow-700 text-white max-h-48 overflow-auto">
          {search.map((s) => (
            <div
              key={s.value}
              className="cursor-pointer p-3 border-b hover:bg-yellow-500"
              onClick={handleSelect(s.value)}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>
      {Object.prototype.hasOwnProperty.call(current, 'nama') && (
        <div className="header my-5 border rounded p-3 bg-white">
          <div className="flex justify-between">
            <div>
              <h2 className="text-md">{current?.nama_latin}</h2>
              <span className="text-md text-gray-700 italic">
                {current?.arti} -
              </span>{' '}
              <span className="text-md text-gray-700 italic">
                {current?.jumlah_ayat} Ayat
              </span>
            </div>
            <div>
              <h2 className="text-4xl">{current?.nama}</h2>
            </div>
          </div>
        </div>
      )}
      <div className="content h-[100vh] overflow-y-scroll">
        {isLoading ? (
          <span className="block mt-6 w-12 h-12 border-4 border-gray-300 mx-auto rounded-full border-t-green-500 animate-spin"></span>
        ) : (
          current.ayat?.map((ayat, idx) => (
            <div
              key={ayat.id}
              className={`p-5 rounded ${
                idx % 2 ? 'bg-yellow-100' : 'bg-yellow-200'
              }`}
            >
              <div className="flex text-right text-3xl mb-3 justify-between">
                <span
                  className="w-8 h-8 rounded-full border border-black shadow text-xl text-center"
                  dangerouslySetInnerHTML={{
                    __html: getArabicNumber(ayat.nomor),
                  }}
                ></span>
                <div className="flex-1">{ayat.ar}</div>
              </div>
              <span className="block italic">{ayat.tr}</span>
              <span className="block font-bold">{ayat.idn}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

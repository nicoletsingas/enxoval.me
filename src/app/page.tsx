"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

type Product = {
  url: string;
  title: string;
  image: string;
  checked: boolean;
}

export default function Home() {
  const [link, setLink] = useState("");
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("enxoval_items");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("enxoval_items", JSON.stringify(items));
  }, [items]);

  const handleAdd = async () => {
    if (!link) return;

    try {
      const resp = await fetch(`/api/scrape?url=${encodeURIComponent(link)}`);
      const data = await resp.json();

      if (data) {
        setItems( prev => [...prev, { ...data, url: link, checked: false }]);
        setLink("");
      }

    } catch (error) {
      console.error("erro ao carregar link:", error);
    }
  }

  const toggleCheck = (index: number) => {
    setItems(prev => 
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  const truncate = (str: string, max: number) => {
    return str.length > max ? str.substring(0, max - 3) + "..." : str;
  };  

  return (
    <main className="max-w-screen-lg mx-auto px-5 py-10 flex flex-col gap-5">
      <h1 className="text-4xl font-bold text-[#d8e2dc] text-center">
        Enxoval.me
      </h1>
      <div className="flex gap-5">
        <Input
          placeholder="Insira o link do produto"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <Button onClick={handleAdd}>Adicionar</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Imagem</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover mr-4 rounded-md"
                />
              </TableCell>
              <TableCell>
                <div
                  className={`${
                    item.checked ? "line-through text-gray-500" : ""
                  } flex flex-col`}
                >
                  <strong>{truncate(item.title, 50)}</strong>
                  <a
                    href={item.url}
                    target="_blank"
                    className="text-[#ffb4a2] underline font-bold"
                  >
                    Ver produto
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleCheck(index)}
                    className="cursor-pointer"
                  />
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Remover item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}

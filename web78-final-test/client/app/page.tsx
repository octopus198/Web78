"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import { Box, Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import Image from "next/image";
import { useEffect, useState } from "react";

type Movie = {
  ID: string;
  name: string;
  time: number;
  year: number;
  image: string;
  introduce: string;
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginAvailable, setIsLoginAvailable] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoginAvailable(true);
    }
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:4000/movies/get");
        const data = await response.json();
        setMovies(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLoginAvailable && (
        <div className="bg-orange-200 h-screen flex items-center justify-center">
          <div className="bg-slate-50 rounded-lg shadow-xl w-6/12 py-5">
            <nav className="flex justify-between px-5 mb-4 items-center">
              <svg
                fontSize={30}
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M3 16h18v2H3zm0-5h18v2H3zm0-5h18v2H3z"
                />
              </svg>
              <div className="flex items-center justify-center gap-2">
                <div className="text-zinc-800 text-2xl font-semibold">
                  MOVIE
                </div>
                <div className=" text-zinc-50 text-2xl bg-orange-600 rounded-full items-center justify-center px-3 py-2">
                  UI
                </div>
              </div>
              <div>
                <svg
                  fontSize={30}
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
                  />
                </svg>
              </div>
            </nav>
            <hr />
            <main className="px-5">
              <h1 className="text-zinc-600 text-xl mb-4 mt-4">
                Most popular movies
              </h1>
              <div className="flex overflow-x-auto gap-4">
                {movies.map((movie) => (
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <div
            
                        key={movie.ID}
                        className=" w-3/12 flex-shrink-0"
                      >
                        <img
                          src={movie.image}
                          alt={movie.name}
                          className="mb-4 object-cover rounded-md overflow-hidden w-[200px] h-[300px] "
                        />
                        <h2 className="text-zinc-900 mb-2 text-lg">
                          {movie.name}
                        </h2>
                        <p className="text-zinc-400">
                          {movie.time} mins {movie.year}
                        </p>
                      </div>
                    </Dialog.Trigger>
                    <Dialog.Content maxWidth="800px">
                      <div className="h-full flex gap-6 ">
                        <img
                          src={movie.image}
                          alt={movie.name}
                          width={300}
                          height={150}
                          className=" object-cover rounded-md"
                        />
                        <div className="mt-8">
                          <h3 className="text-zinc-600 font-normal text-2xl">
                            {movie.name}
                          </h3>
                          <p className="text-sm mt-2 mb-6">
                            {movie.time} mins {movie.year}
                          </p>
                          <p className="text-zinc-600 mb-6">
                            {movie.introduce}
                          </p>
                          <div className="bg-orange-500 w-40 px-4 py-2 rounded-full flex items-center justify-center gap-2">
                            <svg
                              color="white"
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              viewBox="0 0 256 256"
                            >
                              <path
                                fill="currentColor"
                                d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82a16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128"
                              />
                            </svg>{" "}
                            <p className="text-zinc-50 text-lg font-medium">
                              PLAY MOVIE
                            </p>
                          </div>
                        </div>

                        {/* <div onClick={() => handleClosePopup()} className="self-start border-sky-100 rounded-full px-2 py-2 bg-zinc-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"/></svg>
                    </div> */}
                      </div>
                    </Dialog.Content>
                  </Dialog.Root>
                ))}
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}

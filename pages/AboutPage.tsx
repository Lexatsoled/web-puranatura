
import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-emerald-50 py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-display text-green-800">Sobre PuraNatura</h1>
                    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Conectando personas con el poder sanador de la naturaleza.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl font-bold text-green-700 font-display mb-4">Nuestra Filosofía</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            En PuraNatura, nuestra filosofía se centra en la creencia de que el cuerpo posee una capacidad innata para curarse. Nuestro papel es facilitar este proceso a través de métodos naturales, no invasivos y personalizados. Vemos la salud como un estado de equilibrio entre mente, cuerpo y espíritu, y cada terapia que ofrecemos está diseñada para nutrir esta conexión fundamental.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Creemos en la educación y el empoderamiento, guiando a nuestros clientes para que tomen un papel activo en su propio viaje de bienestar.
                        </p>
                    </div>
                    <div className="order-1 md:order-2">
                        <img src="https://picsum.photos/id/30/500/500" alt="Naturaleza y bienestar" className="rounded-lg shadow-xl w-full h-auto object-cover aspect-square"/>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                     <div >
                        <img src="https://picsum.photos/id/152/500/500" alt="Plantas medicinales" className="rounded-lg shadow-xl w-full h-auto object-cover aspect-square"/>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-green-700 font-display mb-4">Nuestra Historia y Valores</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            PuraNatura nació de la pasión por la medicina herbal y un profundo respeto por la sabiduría de la naturaleza. Fundada hace más de una década, nuestro consultorio ha crecido hasta convertirse en un referente de salud natural en la comunidad.
                        </p>
                        <ul className="space-y-3 text-gray-700">
                           <li className="flex items-start"><span className="text-green-500 mr-2">✔</span><strong>Integridad:</strong> Ofrecemos solo productos y terapias en los que confiamos plenamente.</li>
                           <li className="flex items-start"><span className="text-green-500 mr-2">✔</span><strong>Compasión:</strong> Escuchamos con empatía y tratamos a cada cliente con calidez y respeto.</li>
                           <li className="flex items-start"><span className="text-green-500 mr-2">✔</span><strong>Sostenibilidad:</strong> Nos comprometemos a utilizar recursos de manera responsable, cuidando el planeta que nos cuida.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;

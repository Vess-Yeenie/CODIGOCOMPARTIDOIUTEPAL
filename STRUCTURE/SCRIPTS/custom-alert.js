/**
 * ARCHIVO: custom-alert.js
 * Sobrescribe la función nativa window.alert con un diseño personalizado y animaciones premium.
 * Soporta ejecución asíncrona retornando una Promesa (permitiendo usar 'await alert(...)').
 */

window.alert = function(message) {
    return new Promise((resolve) => {
        // Evitar múltiples alertas simultáneas
        if (document.querySelector('.custom-alert-backdrop')) {
            resolve();
            return;
        }

        // Inyectar estilos CSS si no existen
        if (!document.getElementById('custom-alert-styles')) {
            const style = document.createElement('style');
            style.id = 'custom-alert-styles';
            style.innerHTML = `
                .custom-alert-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(4, 34, 78, 0.75);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999999;
                    opacity: 0;
                    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .custom-alert-backdrop.show {
                    opacity: 1;
                }
                .custom-alert-box {
                    background: #04224e;
                    border: 2px solid #fdd534;
                    border-radius: 16px;
                    padding: 30px;
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 
                                0 0 0 1px rgba(253, 213, 52, 0.1);
                    transform: scale(0.8) translateY(-20px);
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    color: #ffffff;
                    font-family: 'Nunito', sans-serif;
                    box-sizing: border-box;
                }
                .custom-alert-backdrop.show .custom-alert-box {
                    transform: scale(1) translateY(0);
                }
                .custom-alert-icon {
                    font-size: 3rem;
                    margin-bottom: 16px;
                    display: inline-block;
                    line-height: 1;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
                    animation: alertIconPop 0.4s ease-out;
                }
                .custom-alert-message {
                    font-size: 1.15rem;
                    line-height: 1.5;
                    margin-bottom: 24px;
                    font-weight: 700;
                    letter-spacing: 0.01em;
                    word-break: break-word;
                }
                .custom-alert-button {
                    background: #fdd534;
                    color: #04224e;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 32px;
                    font-size: 1rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
                    outline: none;
                    box-shadow: 0 4px 15px rgba(253, 213, 52, 0.3);
                }
                .custom-alert-button:hover {
                    background-color: #ffe054;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(253, 213, 52, 0.45);
                }
                .custom-alert-button:focus {
                    box-shadow: 0 0 0 3px rgba(253, 213, 52, 0.5);
                }
                .custom-alert-button:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 8px rgba(253, 213, 52, 0.3);
                }
                @keyframes alertIconPop {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        // Determinar icono según el mensaje
        let icon = "⚠️"; // Alerta / Warning por defecto
        const lowerMessage = message.toLowerCase();
        if (
            lowerMessage.includes("éxito") || 
            lowerMessage.includes("exitosamente") || 
            lowerMessage.includes("correcto") || 
            lowerMessage.includes("correctamente") || 
            lowerMessage.includes("actualizado") || 
            lowerMessage.includes("guardado")
        ) {
            icon = "✔️"; // Éxito
        } else if (
            lowerMessage.includes("error") || 
            lowerMessage.includes("problema") || 
            lowerMessage.includes("falló") || 
            lowerMessage.includes("incorrecto") ||
            lowerMessage.includes("incorrectos") ||
            lowerMessage.includes("no encontrado")
        ) {
            icon = "❌"; // Error
        }

        // Crear elementos del DOM
        const backdrop = document.createElement('div');
        backdrop.className = 'custom-alert-backdrop';
        
        const box = document.createElement('div');
        box.className = 'custom-alert-box';
        
        const iconEl = document.createElement('div');
        iconEl.className = 'custom-alert-icon';
        iconEl.textContent = icon;
        
        const messageEl = document.createElement('div');
        messageEl.className = 'custom-alert-message';
        messageEl.textContent = message;
        
        const button = document.createElement('button');
        button.className = 'custom-alert-button';
        button.textContent = 'Aceptar';
        
        box.appendChild(iconEl);
        box.appendChild(messageEl);
        box.appendChild(button);
        backdrop.appendChild(box);
        document.body.appendChild(backdrop);
        
        // Transición de entrada
        setTimeout(() => {
            backdrop.classList.add('show');
            button.focus();
        }, 20);
        
        // Función de cierre
        const closeAlert = () => {
            backdrop.classList.remove('show');
            setTimeout(() => {
                backdrop.remove();
                resolve(); // Resolver la promesa
            }, 250);
        };

        button.addEventListener('click', closeAlert);
        
        // Atajos de teclado (Enter / Esc)
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
                e.preventDefault();
                closeAlert();
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
    });
};


        let cachedSubjects = [];
        let subjectFilesCache = {};
        let lastFocusedElement = null; // To store the element that opened the modal

        // Replace with your actual Google Drive API Key
        // IMPORTANT: For production, consider using a backend proxy to hide your API key.
        // Exposing API keys in frontend code is generally not recommended for security.
        // const GOOGLE_DRIVE_API_KEY = "AIzaSyB7EeH3hx7I3Kuit6UQdpVD2jnt2QmnAWY";
        // const mainFolderId = "1fCpKx2qCVyqKW-yeR9aGGN-WsQPa1Nbp";

        const GOOGLE_DRIVE_API_KEY = "AIzaSyB7vGBBmmybGA_EvGsvdmhLz8qangORK0I";
        const mainFolderId = "1HR4eNb0yAdus0aOtJYRs8LotClUoNFMG";

        /**
         * Fetches folders (subjects) from Google Drive.
         * @param {string} parentId The ID of the parent folder.
         * @returns {Promise<Array>} A promise that resolves to an array of folders.
         */
        async function fetchFolders(parentId) {
            const url = `https://www.googleapis.com/drive/v3/files?q='${parentId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${GOOGLE_DRIVE_API_KEY}&fields=files(id,name)&orderBy=name`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
                return data.files || [];
            } catch (error) {
                console.error("Error fetching folders:", error);
                notifications.error("فشل في جلب المواد الدراسية. يرجى التحقق من اتصال الإنترنت أو مفتاح API.");
                return [];
            }
        }

        /**
         * Fetches files within a specific folder from Google Drive.
         * @param {string} parentId The ID of the parent folder.
         * @returns {Promise<Array>} A promise that resolves to an array of files.
         */
        async function fetchFiles(parentId) {
            const url = `https://www.googleapis.com/drive/v3/files?q='${parentId}'+in+parents+and+mimeType!='application/vnd.google-apps.folder'&key=${GOOGLE_DRIVE_API_KEY}&fields=files(id,name,size,createdTime,mimeType)&orderBy=modifiedTime`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
                return data.files || [];
            } catch (error) {
                console.error(`Error fetching files for folder ${parentId}:`, error);
                notifications.error("فشل في جلب الملفات. يرجى التحقق من اتصال الإنترنت.");
                return [];
            }
        }

        /**
         * Formats bytes into a human-readable size.
         * @param {number} bytes The size in bytes.
         * @param {number} decimals The number of decimal places to use.
         * @returns {string} The formatted size string.
         */
        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        /**
         * Creates an HTML string for a subject card.
         * @param {object} subject The subject object.
         * @param {Array} files The files associated with the subject.
         * @returns {string} The HTML string for the subject card.
         */
        function createSubjectCard(subject, files) {
            const filesCount = files.length;
            const totalSize = files.reduce((sum, file) => {
                const size = parseInt(file.size);
                return sum + (isNaN(size) ? 0 : size);
            }, 0);
            const formattedSize = totalSize > 0 ? formatBytes(totalSize) : 'غير معروف';

            // Icons for Commerce College subjects
            const iconMap = {
                'محاسبة': 'fas fa-calculator',
                'اقتصاد': 'fas fa-chart-line',
                'إدارة': 'fas fa-users',
                'تسويق': 'fas fa-bullhorn',
                'تمويل': 'fas fa-dollar-sign',
                'إحصاء': 'fas fa-chart-pie',
                'قانون': 'fas fa-gavel',
                'رياضيات': 'fas fa-square-root-alt',
                'تأمين': 'fas fa-shield-alt',
                'ضرائب': 'fas fa-file-invoice-dollar',
                'مراجعة': 'fas fa-clipboard-check',
                'أعمال': 'fas fa-briefcase',
                'مالية': 'fas fa-money-bill-wave',
                'تنمية': 'fas fa-globe',
                'بحوث': 'fas fa-flask',
                'حاسب': 'fas fa-laptop-code',
                'إحصاء': 'fas fa-chart-bar'
            };
            let subjectIcon = 'fas fa-book'; // Default icon
            for (const keyword in iconMap) {
                if (subject.name.includes(keyword)) {
                    subjectIcon = iconMap[keyword];
                    break;
                }
            }

            return `
            <div class="subject-card" data-subject-id="${subject.id}">
                <div class="subject-header">
                    <div class="subject-icon">
                        <i class="${subjectIcon}"></i>
                    </div>
                    <div class="subject-info">
                        <h3 class="subject-title" title="${subject.name}">${subject.name}</h3>
                        <div class="subject-stats">
                            <div class="stat-item" title="عدد الملفات">
                                <i class="fas fa-file-alt"></i>
                                <span>${filesCount} ملف${filesCount !== 1 ? 'ات' : ''}</span>
                            </div>
                            <div class="stat-item" title="الحجم الإجمالي">
                                <i class="fas fa-hdd"></i>
                                <span>${formattedSize}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="expand-button" onclick="openModal(event, '${subject.id}', '${subject.name}')">
                    <span>عرض الملفات</span>
                    <i class="fas fa-folder-open"></i>
                </button>
            </div>
        `;
        }

        /**
         * Creates an HTML string for a file item in the modal.
         * @param {object} file The file object.
         * @returns {string} The HTML string for the file item.
         */
        function createFileItem(file) {
            const mimeType = file.mimeType ? file.mimeType.toLowerCase() : '';
            let fileTypeIcon = 'fas fa-file';
            let iconColor = 'var(--blue-primary)';

            if (mimeType.includes('pdf')) {
                fileTypeIcon = 'fas fa-file-pdf';
                iconColor = 'var(--danger)';
            } else if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
                fileTypeIcon = 'fas fa-file-word';
                iconColor = '#2B579A'; // Microsoft Word blue
            } else if (mimeType.includes('spreadsheetml') || mimeType.includes('excel')) {
                fileTypeIcon = 'fas fa-file-excel';
                iconColor = '#217346'; // Microsoft Excel green
            } else if (mimeType.includes('presentationml') || mimeType.includes('powerpoint')) {
                fileTypeIcon = 'fas fa-file-powerpoint';
                iconColor = '#D24726'; // Microsoft PowerPoint orange
            } else if (mimeType.includes('image')) {
                fileTypeIcon = 'fas fa-file-image';
                iconColor = '#6A1B9A'; // Purple for images
            } else if (mimeType.includes('text/plain')) {
                fileTypeIcon = 'fas fa-file-alt';
                iconColor = 'var(--accent)';
            }

            const formattedDate = file.createdTime ? new Date(file.createdTime).toLocaleDateString('ar-EG') : 'غير معروف';
            const fileSize = file.size ? formatBytes(parseInt(file.size)) : 'غير معروف';

            return `
            <div class="file-item">
                <div class="file-info-top">
                    <div class="file-icon" style="background-color: ${iconColor};" aria-hidden="true">
                        <i class="${fileTypeIcon}"></i>
                    </div>
                    <div class="file-name" title="${file.name}">${file.name}</div>
                </div>
                <div class="file-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
                    <span><i class="fas fa-weight-hanging"></i> ${fileSize}</span>
                </div>
                <button class="download-button" onclick="downloadFile(event, '${file.id}', '${file.name}')" aria-label="تحميل ${file.name}">
                    <i class="fas fa-download"></i>
                    <span>تحميل</span>
                    <div class="progress-bar"></div>
                </button>
            </div>
        `;
        }

        /**
         * Opens the modal and fetches files for a specific subject.
         * @param {Event} event The click event.
         * @param {string} subjectId The ID of the subject folder.
         * @param {string} subjectName The name of the subject.
         */
        async function openModal(event, subjectId, subjectName) {
            lastFocusedElement = event.target; // Store the element that opened the modal

            const modal = document.getElementById('filesModal');
            const modalTitle = document.getElementById('modalSubjectTitle');
            const modalFilesList = document.getElementById('modalFilesList');

            modalTitle.textContent = subjectName;
            modalFilesList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <div class="loading"></div>
                <p>جارٍ تحميل الملفات...</p>
            </div>
        `;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            modal.focus(); // Focus the modal for accessibility

            if (!subjectFilesCache[subjectId]) {
                const files = await fetchFiles(subjectId);
                subjectFilesCache[subjectId] = files;
            }

            const files = subjectFilesCache[subjectId] || [];

            if (files.length === 0) {
                modalFilesList.innerHTML = `
                    <div class="empty-files-state">
                        <i class="fas fa-box-open"></i>
                        <p>لا توجد ملفات متاحة لهذه المادة حاليًا.</p>
                        <p>سيتم تحديث المحتوى قريبًا.</p>
                    </div>
                `;
            } else {
                modalFilesList.innerHTML = files.map(createFileItem).join('');
            }
        }

        /**
         * Closes the modal.
         */
        function closeModal() {
            const modal = document.getElementById('filesModal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (lastFocusedElement) {
                lastFocusedElement.focus(); // Return focus to the element that opened the modal
            }
        }

        /**
         * Initiates file download and shows a notification.
         * @param {Event} event The click event.
         * @param {string} fileId The ID of the file to download.
         * @param {string} fileName The name of the file.
         */
        function downloadFile(event, fileId, fileName) {
            const button = event.target.closest('.download-button');
            const originalContent = button.innerHTML;
            const progressBar = button.querySelector('.progress-bar');

            button.innerHTML = '<div class="loading"></div><span></span>';
            button.disabled = true;
            progressBar.style.width = '0%'; // Reset progress bar

            // Simulate progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                if (progress <= 100) {
                    progressBar.style.width = `${progress}%`;
                }
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 100);


            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i><span>تم التحميل</span>';
                button.classList.add('download-success');
                progressBar.style.width = '100%'; // Ensure full progress

                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.disabled = false;
                    button.classList.remove('download-success');
                    progressBar.style.width = '0%'; // Reset for next use

                    const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
                    const link = document.createElement('a');
                    link.href = downloadLink;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    notifications.success(`تم بدء تحميل "${fileName}" بنجاح`);
                }, 2000); // Duration for "تم التحميل" state
            }, 1500); // Duration for "جاري التحميل" state
        }



        /**
         * Initializes the page by fetching and rendering subjects incrementally.
         */
        async function initializePage() {
            const subjectsGrid = document.getElementById('subjectsGrid');
            // Shimmer loaders are already in HTML, no need to add them here initially.

            try {
                const subjects = await fetchFolders(mainFolderId);

                if (subjects.length === 0) {
                    subjectsGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">لا توجد مواد متاحة حاليًا.</p>`;
                } else {
                    // Fetch all files concurrently
                    const filesPromises = subjects.map(subject => fetchFiles(subject.id));
                    const allFiles = await Promise.all(filesPromises);

                    // Clear shimmer loaders with a fade-out effect
                    subjectsGrid.style.opacity = '0';
                    subjectsGrid.style.transition = 'opacity 0.5s ease-out';

                    setTimeout(() => {
                        subjectsGrid.innerHTML = ''; // Clear shimmer loaders once data is fetched
                        subjectsGrid.style.opacity = '1'; // Reset opacity for new content

                        subjects.forEach((subject, index) => {
                            const files = allFiles[index];
                            subjectFilesCache[subject.id] = files;

                            const card = document.createElement('div');
                            card.innerHTML = createSubjectCard(subject, files);
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(30px)';
                            card.style.transition = 'all 0.5s ease';
                            subjectsGrid.appendChild(card.firstElementChild);

                            // Animate the added card with a staggered delay
                            setTimeout(() => {
                                const addedCard = subjectsGrid.children[index]; // Get the newly added card
                                if (addedCard) {
                                    addedCard.style.opacity = '1';
                                    addedCard.style.transform = 'translateY(0)';
                                }
                            }, 100 * index); // Staggered animation delay
                        });
                    }, 500); // Wait for shimmer to fade out
                }
            } catch (error) {
                console.error("Error initializing page:", error);
                subjectsGrid.innerHTML = `<p style="text-align: center; color: var(--danger);">حدث خطأ أثناء تحميل المواد. يرجى المحاولة مرة أخرى.</p>`;
            }
        }

        document.querySelector('.back-button').addEventListener('click', () => {
            window.history.back();
        });

        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('filesModal');
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = scrollTop / (docHeight - winHeight);
            document.body.style.backgroundPosition = `center ${scrollPercent * 50}px`;
        });

        document.addEventListener('DOMContentLoaded', initializePage);

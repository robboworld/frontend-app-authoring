/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Default course overview HTML samples (mirrors xmodule/templates/about/overview*.yaml).
 * Used so Studio can show EN/RU boilerplate by UI locale while content is still a sample.
 */

export const COURSE_OVERVIEW_SAMPLE_EN = `<section class="about">
  <h2>About This Course</h2>
  <p>Include your long course description here. The long course description should contain 150-400 words.</p>

  <p>This is paragraph 2 of the long course description. Add more paragraphs as needed. Make sure to enclose them in paragraph tags.</p>
</section>

<section class="prerequisites">
  <h2>Requirements</h2>
  <p>Add information about the skills and knowledge students need to take this course.</p>
</section>

<section class="course-staff">
  <h2>Course Staff</h2>
  <article class="teacher">
    <div class="teacher-image">
      <img src="/static/images/placeholder-faculty.png" align="left" alt="Course Staff Image #1" />
    </div>

    <h3>Staff Member #1</h3>
    <p>Biography of instructor/staff member #1</p>
  </article>

  <article class="teacher">
    <div class="teacher-image">
      <img src="/static/images/placeholder-faculty.png" align="left" alt="Course Staff Image #2" />
    </div>

    <h3>Staff Member #2</h3>
    <p>Biography of instructor/staff member #2</p>
  </article>
</section>

<section class="faq">
  <section class="responses">
    <h2>Frequently Asked Questions</h2>
    <article class="response">
      <h3>What web browser should I use?</h3>
      <p>The Open edX platform works best with current versions of Chrome, Edge, Firefox, or Safari.</p>
      <p>See our <a href="https://docs.openedx.org/en/latest/developers/references/developer_guide/testing/browsers.html">list of supported browsers</a> for the most up-to-date information.</p>
    </article>

    <article class="response">
      <h3>Question #2</h3>
      <p>Your answer would be displayed here.</p>
    </article>
  </section>
</section>`;

export const COURSE_OVERVIEW_SAMPLE_RU = `<section class="about">
  <h2>О курсе</h2>
  <p>Вставьте здесь подробное описание курса. Рекомендуемый объём — 150–400 слов.</p>

  <p>Это второй абзац подробного описания. Добавьте столько абзацев, сколько нужно. Оформляйте каждый абзац тегами абзаца.</p>
</section>

<section class="prerequisites">
  <h2>Требования</h2>
  <p>Укажите, какие навыки и знания нужны студентам для прохождения этого курса.</p>
</section>

<section class="course-staff">
  <h2>Преподаватели курса</h2>
  <article class="teacher">
    <div class="teacher-image">
      <img src="/static/images/placeholder-faculty.png" align="left" alt="Фото преподавателя №1" />
    </div>

    <h3>Преподаватель №1</h3>
    <p>Биография преподавателя / сотрудника №1</p>
  </article>

  <article class="teacher">
    <div class="teacher-image">
      <img src="/static/images/placeholder-faculty.png" align="left" alt="Фото преподавателя №2" />
    </div>

    <h3>Преподаватель №2</h3>
    <p>Биография преподавателя / сотрудника №2</p>
  </article>
</section>

<section class="faq">
  <section class="responses">
    <h2>Часто задаваемые вопросы</h2>
    <article class="response">
      <h3>Какой браузер лучше использовать?</h3>
      <p>Платформа Open edX лучше всего работает в актуальных версиях Chrome, Edge, Firefox или Safari.</p>
      <p>См. наш <a href="https://docs.openedx.org/en/latest/developers/references/developer_guide/testing/browsers.html">список поддерживаемых браузеров</a> для самой актуальной информации.</p>
    </article>

    <article class="response">
      <h3>Вопрос №2</h3>
      <p>Здесь будет отображаться ваш ответ.</p>
    </article>
  </section>
</section>`;

const SAMPLE_MARKERS = [
  'include your long course description here',
  'вставьте здесь подробное описание курса',
] as const;

export const isCourseOverviewSample = (html?: string | null): boolean => {
  if (!html) {
    return false;
  }
  const normalized = html.toLowerCase();
  return SAMPLE_MARKERS.some((marker) => normalized.includes(marker));
};

export const getCourseOverviewSample = (locale?: string): string => (
  (locale || 'en').toLowerCase().startsWith('ru')
    ? COURSE_OVERVIEW_SAMPLE_RU
    : COURSE_OVERVIEW_SAMPLE_EN
);

/** If overview is still the default sample, return the sample for the active UI locale. */
export const localizeCourseOverviewSample = (
  overview: string | null | undefined,
  locale?: string,
): string => {
  if (!isCourseOverviewSample(overview)) {
    return overview || '';
  }
  return getCourseOverviewSample(locale);
};

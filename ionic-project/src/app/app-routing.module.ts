import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'applications/4-7',
    loadChildren: () => import('./pages/app-4-7/app-4-7.module').then(m => m.App47PageModule)
  },
  {
    path: 'applications/8-11',
    loadChildren: () => import('./pages/app-8-11/app-8-11.module').then(m => m.App811PageModule)
  },
  {
    path: 'applications/12-15',
    loadChildren: () => import('./pages/app-12-15/app-12-15.module').then(m => m.App1215PageModule)
  },
  {
    path: 'applications/15-17',
    loadChildren: () => import('./pages/app-15-17/app-15-17.module').then(m => m.App1517PageModule)
  },
  {
    path: 'applications/18+',
    loadChildren: () => import('./pages/app-18plus/app-18plus.module').then(m => m.App18plusPageModule)
  },
  {
    path: 'courses',
    loadChildren: () => import('./pages/courses/courses.module').then(m => m.CoursesPageModule)
  },
  {
    path: 'knowledge-vault',
    loadChildren: () => import('./pages/knowledge-vault/knowledge-vault.module').then(m => m.KnowledgeVaultPageModule)
  },
  {
    path: 'flashcard',
    loadChildren: () => import('./pages/flashcard/flashcard.module').then(m => m.FlashcardPageModule)
  },
  {
    path: 'pomoflow',
    loadChildren: () => import('./pages/pomoflow/pomoflow.module').then(m => m.PomoflowPageModule)
  },
  {
    path: 'portfolio',
    loadChildren: () => import('./pages/portfolio/portfolio.module').then(m => m.PortfolioPageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./pages/news/news.module').then(m => m.NewsPageModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./pages/shop/shop.module').then(m => m.ShopPageModule)
  },
  {
    path: 'interview',
    loadChildren: () => import('./pages/interview/interview.module').then(m => m.InterviewPageModule)
  },
  {
    path: 'jobtool',
    loadChildren: () => import('./pages/jobtool/jobtool.module').then(m => m.JobtoolPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

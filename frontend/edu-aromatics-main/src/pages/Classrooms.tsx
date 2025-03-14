
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { classroomApi } from '@/services/api';
import { ClassroomDTO } from '@/types/api';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  ArrowRight, 
  Loader2,
  FileText,
  GridIcon,
  ListIcon
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Classrooms = () => {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<ClassroomDTO[]>([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState<ClassroomDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        if (user?.teacherID) {
          const data = await classroomApi.getClassrooms(user.teacherID);
          setClassrooms(data);
          setFilteredClassrooms(data);
        }
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [user]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = classrooms.filter(classroom => 
        classroom.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classroom.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClassrooms(filtered);
    } else {
      setFilteredClassrooms(classrooms);
    }
  }, [searchQuery, classrooms]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-10 flex justify-center items-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading classrooms...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-10 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Classrooms</h1>
            <p className="text-muted-foreground mt-1">
              Manage your virtual classrooms and AR experiences
            </p>
          </div>
          <Button asChild className="button-effect">
            <Link to="/classrooms/new">
              <Plus className="h-4 w-4 mr-2" />
              New Classroom
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search classrooms..."
              className="w-full pl-8 input-focus"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-9 w-9"
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-9 w-9"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredClassrooms.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center">
              <GraduationCap className="h-10 w-10 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">
                {searchQuery ? 'No classrooms found' : 'No classrooms yet'}
              </CardTitle>
              <CardDescription className="mb-4">
                {searchQuery
                  ? `No classrooms match your search for "${searchQuery}"`
                  : 'Create your first classroom to get started with AR4Learn'}
              </CardDescription>
              {!searchQuery && (
                <Button asChild>
                  <Link to="/classrooms/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Classroom
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {viewMode === 'grid' && filteredClassrooms.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClassrooms.map((classroom) => (
              <Card key={classroom.classroomID} className="card-hover overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle>{classroom.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {classroom.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 border-t flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/classrooms/${classroom.classroomID}`)}
                  >
                    Manage
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/classrooms/${classroom.classroomID}/experiences/new`}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Experience
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/classrooms/${classroom.classroomID}/edit`}>
                          <FileText className="h-4 w-4 mr-2" />
                          Edit Details
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {viewMode === 'list' && filteredClassrooms.length > 0 && (
          <div className="space-y-4">
            {filteredClassrooms.map((classroom) => (
              <Card key={classroom.classroomID} className="overflow-hidden hover:border-primary/50 transition-colors">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{classroom.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {classroom.description || 'No description provided'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/classrooms/${classroom.classroomID}`)}
                    >
                      Manage
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/classrooms/${classroom.classroomID}/experiences/new`}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Experience
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/classrooms/${classroom.classroomID}/edit`}>
                            <FileText className="h-4 w-4 mr-2" />
                            Edit Details
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Classrooms;
